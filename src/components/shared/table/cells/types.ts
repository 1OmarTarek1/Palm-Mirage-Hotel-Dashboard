export type CellDisplayMode = "table" | "card" | "card-compact";

export interface CellProps<T = unknown> {
  row: T;
  column: import("../types").Column<T>;
  resolvedValue: unknown;
  displayMode?: CellDisplayMode;
}
