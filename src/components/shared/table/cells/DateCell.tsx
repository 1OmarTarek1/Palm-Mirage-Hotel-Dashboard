import React from "react";
import { CellProps } from "./types";

export default function DateCell({ resolvedValue }: CellProps) {
  return (
    <span className="inline-block text-center text-xs font-bold text-gray-400 tracking-tight">
      {String(resolvedValue)}
    </span>
  );
}
