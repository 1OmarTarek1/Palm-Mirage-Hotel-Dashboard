import React from "react";
import { CellProps } from "./types";

export default function TextCell({ resolvedValue }: CellProps) {
  return (
    <span className="inline-block text-center text-[13.5px] font-medium text-gray-700">
      {String(resolvedValue)}
    </span>
  );
}
