"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "@/store/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/slices/themeSlice";

function ThemeSync() {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.theme.isDark);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("theme");
      const resolvedTheme =
        savedTheme === "dark"
          ? true
          : savedTheme === "light"
            ? false
            : window.matchMedia("(prefers-color-scheme: dark)").matches;

      dispatch(setTheme(resolvedTheme));
    } catch {
      dispatch(setTheme(false));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return null;
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeSync />
      {children}
      <ToastContainer
        position="top-left"
        autoClose={3000}
        limit={5}
        newestOnTop
        className="mt-20"
        toastClassName="!bg-card !text-foreground !font-main !rounded-xl !border !border-border !shadow-lg !shadow-black/5 !overflow-hidden !px-4 !pr-6 !py-4"
        toastStyle={{ fontSize: "0.8rem" }}
      />
    </Provider>
  );
}
