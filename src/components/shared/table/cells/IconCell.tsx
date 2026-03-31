import React from "react";
import { CellProps } from "./types";
import { DynamicIcon } from "@/components/shared/utils/icons";

export default function IconCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const iconName = String(resolvedValue);

  return (
    <div className={`flex ${displayMode === "card" ? "justify-start" : "justify-center"}`}>
      <div
        className={`flex items-center justify-center rounded-2xl border border-border bg-muted text-primary shadow-sm ${
          displayMode === "card-compact" ? "h-8 w-8" : "h-10 w-10"
        }`}
      >
        <DynamicIcon name={iconName} size={18} />
      </div>
    </div>
  );
}
