import React from "react";
import { CellProps } from "./types";

export default function CountCell({ resolvedValue, displayMode = "table" }: CellProps) {
  return (
    <div
      className={`flex items-center gap-2 ${
        displayMode === "card" ? "justify-start" : "justify-center"
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-2xl border border-border bg-card font-main font-black text-primary shadow-md ${
          displayMode === "card-compact" ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]"
        }`}
      >
        {resolvedValue}
      </span>
    </div>
  );
}
