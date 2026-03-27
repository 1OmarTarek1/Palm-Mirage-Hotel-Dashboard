import React from "react";
import { CellProps } from "./types";

export default function CountCell({ resolvedValue }: CellProps) { // column
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-[10px] font-black text-indigo-600 bg-white w-7 h-7 rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
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
