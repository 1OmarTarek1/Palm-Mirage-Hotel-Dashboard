import React from "react";
import { CellProps } from "./types";

export default function TextCell({ resolvedValue, displayMode = "table" }: CellProps) {
  return (
    <span
      className={`inline-block font-main ${
        displayMode === "card-compact"
          ? "text-center text-[11px] leading-tight font-semibold text-foreground"
          : 
        displayMode === "card"
          ? "text-left text-sm font-semibold text-foreground"
          : "text-center text-[13.5px] font-medium text-foreground/80"
      }`}
    >
      {String(resolvedValue)}
    </span>
  );
}
