import React from "react";
import { CellProps } from "./types";

export default function ImageCardCell({ row, column, resolvedValue }: CellProps) {
  const imageKey = column.config?.imageKey || "image";
  const subtitleKey = column.config?.subtitleKey || "label";
  const imageUrl = (row as any)[imageKey];
  const subtitle = (row as any)[subtitleKey];
  const isLeftAligned = column.cellAlign === "left";
  const isRightAligned = column.cellAlign === "right";

  return (
    <div
      className={`flex items-center gap-5 ${
        isLeftAligned ? "justify-start text-left" : isRightAligned ? "justify-end text-right" : "justify-center text-center"
      }`}
    >
      <div className="h-16 w-24 overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100/50">
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
      <div className={`flex flex-col gap-0.5 ${isLeftAligned ? "items-start" : isRightAligned ? "items-end" : "items-center"}`}>
        <span className="text-sm font-extrabold text-[#111111] leading-tight">{String(resolvedValue)}</span>
        {subtitle && (
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-80">
            {String(subtitle)}
          </span>
        )}
      </div>
    </div>
  );
}
