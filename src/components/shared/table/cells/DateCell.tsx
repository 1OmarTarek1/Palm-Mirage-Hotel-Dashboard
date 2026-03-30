import React from "react";
import { CellProps } from "./types";

export default function DateCell({ resolvedValue, displayMode = "table" }: CellProps) {
  return (
    <span
      className={`inline-block font-main font-semibold tracking-tight ${
        displayMode === "card-compact"
          ? "text-center text-[11px] leading-tight text-foreground"
          :
        displayMode === "card"
          ? "text-left text-sm text-foreground"
          : "text-center text-xs text-muted-foreground"
      }`}
    >
      {String(resolvedValue)}
    </span>
  );
}
