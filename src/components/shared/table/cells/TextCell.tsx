import React from "react";
import { CellProps } from "./types";

export default function TextCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const value = String(resolvedValue ?? "");

  return (
    <span
      title={value}
      className={`inline-block font-main ${
        displayMode === "card-compact"
          ? "max-w-full truncate text-center text-[11px] leading-tight font-semibold text-foreground"
          : 
        displayMode === "card"
          ? "max-w-full truncate text-left text-sm font-semibold text-foreground"
          : "block max-w-[14rem] truncate text-center text-[13.5px] font-medium text-foreground/80"
      }`}
    >
      {value}
    </span>
  );
}
