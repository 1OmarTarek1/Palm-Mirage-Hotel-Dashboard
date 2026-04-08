import React from "react";
import { CellProps } from "./types";

export default function DateCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const value = String(resolvedValue ?? "");

  return (
    <span
      title={value}
      className={`inline-block font-main font-semibold tracking-tight ${
        displayMode === "card-compact"
          ? "max-w-full truncate text-center text-[11px] leading-tight text-foreground"
          :
        displayMode === "card"
          ? "max-w-full truncate text-left text-sm text-foreground"
          : "block max-w-[8.5rem] truncate text-center text-xs text-muted-foreground"
      }`}
    >
      {value}
    </span>
  );
}
