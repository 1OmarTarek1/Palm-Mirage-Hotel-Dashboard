import React from "react";
import { CellProps } from "./types";

export default function DateCell({ resolvedValue }: CellProps) {
  return (
    <span className="inline-block text-center font-main text-xs font-semibold tracking-tight text-muted-foreground">
      {String(resolvedValue)}
    </span>
  );
}
