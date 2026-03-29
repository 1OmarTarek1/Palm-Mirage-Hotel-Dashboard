export interface CellProps<T = any> {
  row: T;
  column: import("../types").Column<T>;
  resolvedValue: any;
}
