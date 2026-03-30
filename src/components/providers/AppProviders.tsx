"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { useThemeSync } from "@/hooks/useThemeSync";
import { store } from "@/store/store";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  useThemeSync();

  return (
    <Provider store={store}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={5}
        newestOnTop
        className="mb-4 mr-4"
        toastClassName="!bg-card !text-foreground !font-main !rounded-xl !border !border-border !shadow-lg !shadow-black/5 !overflow-hidden !px-4 !pr-6 !py-4"
        toastStyle={{ fontSize: "0.8rem" }}
      />
    </Provider>
  );
}
