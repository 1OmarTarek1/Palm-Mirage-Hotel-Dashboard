"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bell, Globe, LogOut, Moon, PanelRightOpen, Settings, Sun, User } from "lucide-react";

import {
  NavbarDropdown,
  NavbarDropdownDivider,
  NavbarDropdownHeader,
  NavbarDropdownItems,
  NavbarDropdownSection,
} from "./NavbarDropdown";

interface NavbarActionsProps {
  pathname: string;
  notificationCount: number;
  displayName: string;
  displayEmail: string;
  displayAvatar?: string | null;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onSignOut: () => void;
  isAlertsPanelOpen?: boolean;
  onAlertsPanelToggle?: () => void;
}

export default function NavbarActions({
  pathname,
  notificationCount,
  displayName,
  displayEmail,
  displayAvatar,
  isDarkMode,
  onThemeToggle,
  onSignOut,
  isAlertsPanelOpen = false,
  onAlertsPanelToggle,
}: NavbarActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userMenuItems = [
    {
      href: "/profile",
      label: "My Profile",
      icon: <User className="h-4 w-4" />,
      isActive: pathname === "/profile",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      isActive: pathname === "/settings",
    },
  ];

  const languageItems = [
    {
      label: "English",
      isActive: language === "en",
      onClick: () => setLanguage("en"),
    },
    {
      label: "العربية",
      isActive: language === "ar",
      onClick: () => setLanguage("ar"),
      className: "font-main",
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {onAlertsPanelToggle ? (
        <button
          onClick={onAlertsPanelToggle}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm font-medium transition-all duration-200 sm:w-auto sm:gap-2 sm:px-3 ${
            isAlertsPanelOpen
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"
          }`}
          type="button"
          aria-label={isAlertsPanelOpen ? "Close alerts panel" : "Open alerts panel"}
          aria-pressed={isAlertsPanelOpen}
        >
          <PanelRightOpen className="h-4 w-4" />
          <span className="font-main hidden sm:inline">Alerts</span>
        </button>
      ) : null}

      <div className="relative z-[120] hidden sm:block" ref={langDropdownRef}>
        <button
          onClick={() => setLangDropdownOpen((value) => !value)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary"
          type="button"
        >
          <Globe className="h-5 w-5" />
        </button>

        <NavbarDropdown isOpen={langDropdownOpen} className="z-[130] w-56">
          <NavbarDropdownSection>
            <NavbarDropdownItems
              items={languageItems}
              onItemClick={() => setLangDropdownOpen(false)}
            />
          </NavbarDropdownSection>
        </NavbarDropdown>
      </div>

      <button
        onClick={onThemeToggle}
        className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary sm:flex"
        aria-label="Toggle theme"
        type="button"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <button
        className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:text-primary"
        type="button"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-2 ring-card transition-transform duration-150 group-hover:scale-110">
            {notificationCount > 99 ? "+99" : notificationCount}
          </span>
        ) : null}
      </button>

      <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

      <div className="relative z-[120]" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((value) => !value)}
          className="flex cursor-pointer items-center rounded-full transition-all duration-150 focus:outline-none"
          type="button"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-card transition-all duration-200 hover:border-primary hover:bg-primary/10">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar"
                width={40}
                height={40}
                className="h-full w-full cursor-pointer rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border border-border/70 text-muted-foreground">
                <User className="h-6 w-6" />
              </div>
            )}
          </div>
        </button>

        <NavbarDropdown isOpen={dropdownOpen} className="z-[130] w-64">
          <NavbarDropdownHeader>
            <p className="font-header truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            <p className="font-main truncate text-xs text-muted-foreground">
              {displayEmail}
            </p>
          </NavbarDropdownHeader>

          <NavbarDropdownSection>
            <NavbarDropdownItems
              items={userMenuItems}
              onItemClick={() => setDropdownOpen(false)}
            />
          </NavbarDropdownSection>

          <div className="block sm:hidden">
            <NavbarDropdownDivider />

            <NavbarDropdownSection className="space-y-1.5">
              <div className="flex items-center justify-between rounded-xl px-2 py-1.5">
                <div className="font-main flex items-center gap-3 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{language === "ar" ? "العربية" : "English"}</span>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setLanguage((current) => (current === "en" ? "ar" : "en"));
                  }}
                  className={`relative h-6 w-13 cursor-pointer rounded-full text-[8px] font-bold uppercase tracking-[0.08em] transition-colors duration-300 focus:outline-none ${
                    language === "ar"
                      ? "bg-primary text-white"
                      : "bg-border text-muted-foreground"
                  }`}
                  type="button"
                  aria-label="Toggle language"
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                      language === "ar"
                        ? "right-1.5 opacity-100"
                        : "left-1.5 opacity-100"
                    }`}
                  >
                    {language === "ar" ? "AR" : "EN"}
                  </span>
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      language === "ar"
                        ? "left-1 translate-x-0"
                        : "left-1 translate-x-7"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl px-2 py-1.5">
                <div className="font-main flex items-center gap-3 text-sm text-muted-foreground">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onThemeToggle();
                  }}
                  className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none ${
                    isDarkMode ? "bg-primary" : "bg-border"
                  }`}
                  type="button"
                >
                  <span
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      isDarkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </NavbarDropdownSection>
          </div>

          <NavbarDropdownDivider />

          <NavbarDropdownSection>
            <NavbarDropdownItems
              items={[
                {
                  label: "Sign out",
                  icon: <LogOut className="h-4 w-4" />,
                  onClick: onSignOut,
                  className:
                    "text-red-500/80 hover:bg-red-500/10 hover:text-red-500",
                },
              ]}
              onItemClick={() => setDropdownOpen(false)}
            />
          </NavbarDropdownSection>
        </NavbarDropdown>
      </div>
    </div>
  );
}
