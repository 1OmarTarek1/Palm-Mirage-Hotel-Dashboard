import React from "react";
import { CellProps } from "./types";

export default function BadgeCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const value = String(resolvedValue);
  const label = value === "true" ? "Active" : value === "false" ? "Hidden" : value;

  const getVariantClasses = (val: string) => {
    const normalized = val.toLowerCase();
    
    // Status colors
    if (["available", "active", "confirmed", "true"].includes(normalized)) {
      return "bg-emerald-500/10 text-emerald-600 ring-emerald-600/20";
    }
    if (["maintenance", "pending", "busy", "away"].includes(normalized)) {
      return "bg-amber-500/10 text-amber-600 ring-amber-600/20";
    }
    if (["closed", "busy", "inactive", "false", "deleted"].includes(normalized)) {
      return "bg-rose-500/10 text-rose-600 ring-rose-600/20";
    }
    
    // Category colors (fallback to primary)
    return "bg-primary/10 text-primary ring-primary/20";
  };

  return (
    <div className={`flex ${displayMode === "card" ? "justify-start" : "justify-center"}`}>
      <span
        className={`inline-flex items-center rounded-full font-main font-bold uppercase tracking-widest ring-1 ring-inset shadow-sm transition-colors duration-300 ${getVariantClasses(value)} ${
          displayMode === "card" ? "px-2.5 py-1 text-[9px]" : "px-3 py-1 text-[10px]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
