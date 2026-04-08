import React from "react";
import Image from "next/image";
import { CellProps } from "./types";
import { DynamicIcon } from "@/components/shared/utils/icons";

export default function ImageCardCell({
  row,
  column,
  resolvedValue,
  displayMode = "table",
}: CellProps) {
  const imageKey = column.config?.imageKey || "image";
  const iconKey = column.config?.iconKey || "icon";
  const subtitleKey = column.config?.subtitleKey || "label";
  const record = row as Record<string, unknown>;
  const imageUrlValue =
    typeof imageKey === "string" ? record[imageKey] : undefined;
  const iconNameValue =
    typeof iconKey === "string" ? record[iconKey] : undefined;
  const subtitle =
    typeof subtitleKey === "string" ? record[subtitleKey] : undefined;
  const imageUrl = typeof imageUrlValue === "string" ? imageUrlValue : undefined;
  const iconName = typeof iconNameValue === "string" ? iconNameValue : undefined;
  const subtitleText =
    typeof subtitle === "string" || typeof subtitle === "number"
      ? String(subtitle)
      : null;
  const isLeftAligned = displayMode === "card" || column.cellAlign === "left";
  const isRightAligned = column.cellAlign === "right";

  return (
    <div
      className={`inline-flex min-w-0 items-center ${
        displayMode === "card" ? "gap-3" : "gap-5"
      } ${
        isLeftAligned ? "justify-start text-left" : isRightAligned ? "justify-end text-right" : "justify-center text-center"
      }`}
    >
      <div
        className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted shadow-sm transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 ${
          displayMode === "card" ? "h-12 w-16 rounded-[18px]" : "h-16 w-24"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={String(resolvedValue)}
            fill
            unoptimized
            sizes={displayMode === "card" ? "64px" : "96px"}
            className="object-cover transition-transform duration-700 hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/40 transition-colors group-hover:text-primary">
            <DynamicIcon 
              name={iconName || (resolvedValue as string)} 
              size={displayMode === "card" ? 22 : 28} 
              className="opacity-70 group-hover:opacity-100" 
            />
          </div>
        )}
      </div>
      <div
        className={`min-w-0 flex flex-col gap-0.5 ${
          isLeftAligned ? "items-start" : isRightAligned ? "items-end" : "items-center"
        }`}
      >
        <span
          title={String(resolvedValue ?? "")}
          className={`font-header font-extrabold leading-tight text-foreground ${
            displayMode === "card"
              ? "block max-w-full truncate text-sm"
              : "block max-w-[11.5rem] truncate text-sm"
          }`}
        >
          {String(resolvedValue ?? "")}
        </span>
        {subtitleText && (
          <span
            title={subtitleText}
            className={`font-main font-black uppercase tracking-widest text-primary/85 ${
              displayMode === "card"
                ? "block max-w-full truncate text-[9px]"
                : "block max-w-[11rem] truncate text-[10px]"
            }`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
}
