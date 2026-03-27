import React from "react";
import { CellProps } from "./types";

export default function TextCell({ resolvedValue }: CellProps) {
  return (
    <span className="inline-block text-center font-main text-[13.5px] font-medium text-foreground/80">
      {String(resolvedValue)}
    </span>
  );
}
