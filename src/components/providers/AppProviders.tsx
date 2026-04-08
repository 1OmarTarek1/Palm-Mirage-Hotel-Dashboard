"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { useThemeSync } from "@/hooks/useThemeSync";
import { dashboardQueryClient } from "@/lib/dashboardQueryClient";
import { store } from "@/store/store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  useThemeSync();

  return (
    <QueryClientProvider client={dashboardQueryClient}>
      <Provider store={store}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          limit={5}
          newestOnTop
          className="!top-20 !right-4 !m-0"
          style={{
            top: "5.25rem",
            right: "1rem",
            width: "min(26rem, calc(100vw - 1.5rem))",
          }}
          toastClassName="!bg-card !text-foreground !font-main !rounded-xl !border !border-border !shadow-lg !shadow-black/5 !overflow-hidden !px-4 !pr-6 !py-4"
          toastStyle={{ fontSize: "0.8rem" }}
        />
      </Provider>
    </QueryClientProvider>
  );
}
