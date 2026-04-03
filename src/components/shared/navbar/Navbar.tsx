"use client";

import { usePathname, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";

import NavbarActions from "./NavbarActions";
import NavbarBrand from "./NavbarBrand";
import type { ActiveUser, NavbarProps } from "./types";

export default function Navbar({
  user: userProp,
  notificationCount = 0,
  onSignOut,
}: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDark);

  const activeUser = (session?.user as ActiveUser | undefined) || userProp || null;
  const displayName = activeUser?.name || "Guest User";
  const displayEmail = activeUser?.email || "guest@example.com";
  const displayAvatar = activeUser?.image || activeUser?.avatarUrl;

  const handleThemeToggle = () => {
    document.cookie = `theme=${isDarkMode ? "light" : "dark"}; path=/; max-age=31536000; samesite=lax`;
    window.dispatchEvent(new Event("theme-preference-saved"));
    dispatch(toggleTheme());
  };

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
      return;
    }

    await signOut({ redirect: false, callbackUrl: "/login" });
    toast.success("Logged out successfully.");
    window.setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  return (
    <header
      className="sticky top-0 z-[140] h-[4.5rem] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_10%,var(--background))_0%,var(--background)_32%,var(--background)_100%)] backdrop-blur-md transition-colors duration-300 after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[linear-gradient(90deg,transparent_0%,transparent_12%,color-mix(in_srgb,var(--border)_72%,transparent)_34%,color-mix(in_srgb,var(--border)_92%,transparent)_100%)] after:content-['']"
      style={{ paddingRight: "var(--removed-body-scroll-bar-size, 0px)" }}
    >
      <div className="flex h-full items-center justify-between gap-3 px-4 md:justify-end md:px-6 lg:px-8">
        <NavbarBrand />
        <NavbarActions
          pathname={pathname}
          notificationCount={notificationCount}
          displayName={displayName}
          displayEmail={displayEmail}
          displayAvatar={displayAvatar}
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          onSignOut={handleSignOut}
        />
      </div>
    </header>
  );
}
