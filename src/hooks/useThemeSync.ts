"use client";

import { useEffect } from "react";

import { setTheme } from "@/store/slices/themeSlice";
import { store } from "@/store/store";

const THEME_COOKIE_NAME = "theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readThemeCookie() {
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${THEME_COOKIE_NAME}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function resolveThemePreference() {
  const savedTheme = readThemeCookie();

  if (savedTheme === "dark") {
    return { isDark: true, hasStoredPreference: true };
  }

  if (savedTheme === "light") {
    return { isDark: false, hasStoredPreference: true };
  }

  return {
    isDark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    hasStoredPreference: false,
  };
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function writeThemeCookie(isDark: boolean) {
  document.cookie = `${THEME_COOKIE_NAME}=${isDark ? "dark" : "light"}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

export function useThemeSync() {
  useEffect(() => {
    const { isDark, hasStoredPreference } = resolveThemePreference();

    applyTheme(isDark);
    store.dispatch(setTheme(isDark));

    let hasExplicitPreference = hasStoredPreference;

    const unsubscribe = store.subscribe(() => {
      const nextIsDark = store.getState().theme.isDark;
      applyTheme(nextIsDark);

      if (hasExplicitPreference) {
        writeThemeCookie(nextIsDark);
      }
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (readThemeCookie()) {
        return;
      }

      applyTheme(event.matches);
      store.dispatch(setTheme(event.matches));
    };

    const handleThemePreferenceSaved = () => {
      hasExplicitPreference = true;
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("theme-preference-saved", handleThemePreferenceSaved);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("theme-preference-saved", handleThemePreferenceSaved);
    };
  }, []);
}
