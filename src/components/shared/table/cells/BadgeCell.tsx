import React from "react";
import { CellProps } from "./types";

export default function BadgeCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const value = String(resolvedValue);
  const label = value === "true" ? "Active" : value === "false" ? "Hidden" : value;

  return (
    <div className={`flex ${displayMode === "card" ? "justify-start" : "justify-center"}`}>
      <span
        className={`inline-flex items-center rounded-full bg-primary/10 font-main font-bold uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/15 shadow-sm ${
          displayMode === "card" ? "px-2.5 py-1 text-[9px]" : "px-3 py-1 text-[10px]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
