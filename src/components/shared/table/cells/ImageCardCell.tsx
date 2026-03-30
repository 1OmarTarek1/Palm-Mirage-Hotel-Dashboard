import React from "react";
import { CellProps } from "./types";

export default function ImageCardCell({
  row,
  column,
  resolvedValue,
  displayMode = "table",
}: CellProps) {
  const imageKey = column.config?.imageKey || "image";
  const subtitleKey = column.config?.subtitleKey || "label";
  const record = row as Record<string, unknown>;
  const imageUrlValue =
    typeof imageKey === "string" ? record[imageKey] : undefined;
  const subtitle =
    typeof subtitleKey === "string" ? record[subtitleKey] : undefined;
  const imageUrl = typeof imageUrlValue === "string" ? imageUrlValue : undefined;
  const isLeftAligned = displayMode === "card" || column.cellAlign === "left";
  const isRightAligned = column.cellAlign === "right";

  return (
    <div
      className={`flex items-center ${
        displayMode === "card" ? "gap-3" : "gap-5"
      } ${
        isLeftAligned ? "justify-start text-left" : isRightAligned ? "justify-end text-right" : "justify-center text-center"
      }`}
    >
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-muted shadow-sm ${
          displayMode === "card" ? "h-12 w-16 rounded-[18px]" : "h-16 w-24"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={String(resolvedValue)}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>
      <div
        className={`flex flex-col gap-0.5 ${
          isLeftAligned ? "items-start" : isRightAligned ? "items-end" : "items-center"
        }`}
      >
        <span
          className={`font-header font-extrabold leading-tight text-foreground ${
            displayMode === "card" ? "text-sm" : "text-sm"
          }`}
        >
          {String(resolvedValue)}
        </span>
        {subtitle && (
          <span
            className={`font-main font-black uppercase tracking-widest text-primary/85 ${
              displayMode === "card" ? "text-[9px]" : "text-[10px]"
            }`}
          >
            {String(subtitle)}
          </span>
        )}
      </div>
    </div>
  );
}
