import React from "react";
import { CellProps } from "./types";

export default function CountCell({ resolvedValue }: CellProps) { // column
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-2xl border border-border bg-card font-main text-[10px] font-black text-primary shadow-md">
        {resolvedValue}
      </span>
      {/* {column.config?.suffix && (
        <span className="text-xs font-semibold text-gray-400 lowercase italic">
          {column.config.suffix}
        </span>
      )} */}
    </div>
  );
}
