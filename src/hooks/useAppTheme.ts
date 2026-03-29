"use client";

import { useTheme } from "next-themes";

export function useAppTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === "dark",
  };
}
