import React from "react";
import { CellProps } from "./types";

export default function BadgeCell({ resolvedValue }: CellProps) {
  return (
    <div className="flex justify-center">
      <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-main text-[10px] font-bold uppercase tracking-widest text-primary ring-1 ring-inset ring-primary/15 shadow-sm">
        {String(resolvedValue)}
      </span>
    </div>
  );
}
