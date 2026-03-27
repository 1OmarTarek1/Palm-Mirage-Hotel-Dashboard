import React from "react";
import { CellProps } from "./types";

export default function BadgeCell({ resolvedValue }: CellProps) {
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-widest ring-1 ring-inset ring-indigo-600/10 shadow-sm">
        {String(resolvedValue)}
      </span>
    </div>
  );
}
