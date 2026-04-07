import type { ReactNode } from "react";

export type CellDisplayMode = "table" | "card" | "card-compact";

export interface CellProps<T = unknown> {
  row: T;
  column: import("../types").Column<T>;
  resolvedValue: ReactNode;
  displayMode?: CellDisplayMode;
}
