"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DrawerShellProps {
  isMounted: boolean;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DrawerShell({
  isMounted,
  isOpen,
  onClose,
  children,
}: DrawerShellProps) {
  if (!isMounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[140] transition-opacity duration-300 lg:hidden",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close filters"
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 flex h-screen w-[88vw] max-w-[320px] flex-col border-l border-sidebar-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_12%,var(--background))_0%,var(--background)_22%,var(--background)_100%)] text-sidebar-foreground shadow-2xl transition-transform duration-300 sm:w-[76vw] sm:max-w-[350px] md:w-[68vw] md:max-w-[380px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {children}
      </aside>
    </div>,
    document.body
  );
}
