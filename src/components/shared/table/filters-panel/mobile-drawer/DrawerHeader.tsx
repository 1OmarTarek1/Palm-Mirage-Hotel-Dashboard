"use client";

import React from "react";
import { X } from "lucide-react";

interface DrawerHeaderProps {
  activeFiltersCount: number;
  onClose: () => void;
}

export default function DrawerHeader({
  activeFiltersCount,
  onClose,
}: DrawerHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-sidebar-border px-4 py-3.5">
      <div>
        <h3 className="font-header text-sm font-black uppercase tracking-[0.2em] text-primary">
          Filters
        </h3>
        <p className="mt-1 font-main text-xs text-sidebar-accent-foreground">
          {activeFiltersCount > 0
            ? `${activeFiltersCount} active filter${activeFiltersCount > 1 ? "s" : ""}`
            : "Refine the current results"}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-sidebar-border bg-primary/8 text-sidebar-foreground/75 transition-colors hover:border-primary/12 hover:bg-primary/12 hover:text-sidebar-foreground/85"
      >
        <X size={18} />
      </button>
    </header>
  );
}
