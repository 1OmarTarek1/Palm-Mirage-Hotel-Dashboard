"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Globe, LogOut, Moon, Settings, Sun, User } from "lucide-react";

interface NavbarActionsProps {
  pathname: string;
  notificationCount: number;
  displayName: string;
  displayEmail: string;
  displayAvatar?: string | null;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  onSignOut: () => void;
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
}: NavbarActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }

      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="relative z-[120] hidden sm:block" ref={langDropdownRef}>
        <button
          onClick={() => setLangDropdownOpen((value) => !value)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary"
          type="button"
        >
          <Globe className="h-5 w-5" />
        </button>

        {langDropdownOpen ? (
          <div className="absolute right-0 top-[calc(100%+8px)] z-[130] w-28 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col py-1.5">
              <button
                onClick={() => {
                  setLanguage("en");
                  setLangDropdownOpen(false);
                }}
                className={`font-main cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
                  language === "en"
                    ? "bg-muted text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
                type="button"
              >
                English
              </button>
              <button
                onClick={() => {
                  setLanguage("ar");
                  setLangDropdownOpen(false);
                }}
                className={`font-main cursor-pointer px-4 py-2 text-left text-sm transition-colors ${
                  language === "ar"
                    ? "bg-muted text-primary"
                    : "text-foreground hover:bg-muted hover:text-primary"
                }`}
                style={{ fontFamily: "Arial, sans-serif" }}
                type="button"
              >
                العربية
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <button
        onClick={onThemeToggle}
        className="hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary sm:flex"
        aria-label="Toggle theme"
        type="button"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <button
        className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:border-primary hover:text-primary"
        type="button"
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
          <div className="relative h-10 w-10 rounded-full border border-border bg-card transition-all duration-200 hover:border-primary">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full border border-border/70 text-muted-foreground">
                <User className="h-6 w-6" />
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>
        </button>

        {dropdownOpen ? (
          <div className="absolute right-0 top-[calc(100%+8px)] z-[130] w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="border-b border-border px-4 py-3">
              <p className="font-header truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="font-main truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
            </div>

            <div className="py-1.5">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className={`font-main flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100 ${
                  pathname === "/profile"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" /> My Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className={`font-main flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100 ${
                  pathname === "/settings"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Settings className="h-4 w-4" /> Settings
              </Link>

              <div className="block sm:hidden">
                <div className="my-1.5 border-t border-border" />

                <div className="flex items-center justify-between px-4 py-2">
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
                      language === "ar" ? "bg-primary text-white" : "bg-border text-muted-foreground"
                    }`}
                    type="button"
                    aria-label="Toggle language"
                  >
                    <span
                      className={`absolute top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                        language === "ar" ? "right-1.5 opacity-100" : "left-1.5 opacity-100"
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

                <div className="flex items-center justify-between px-4 py-2">
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
              </div>

              <div className="my-1.5 border-t border-border" />

              <button
                onClick={onSignOut}
                className="font-main flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors duration-100 hover:bg-red-500/10"
                type="button"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
