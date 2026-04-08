export interface Column<T> {
  key: keyof T | string; // Allow arbitrary keys for custom accessors
  title: string;
  cellAlign?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  accessorKey?: string;
  type?: "text" | "image-card" | "badge" | "icon" | "count" | "date" | "action-dropdown";
  accessorType?: "text" | "join" | "count" | "date";
  config?: Record<string, unknown>;
}

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: "select" | "range";
  options?: FilterOption[];
}

export interface SortConfig<T> {
  key: Column<T>["key"];
  direction: "asc" | "desc";
}
export interface TableQueryState<T> {
  page: number;
  pageSize: number;
  search: string;
  filters: Filters<T>;
  sort: SortConfig<T> | null;
}

export interface RangeFilterValue {
  min?: number | string;
  max?: number | string;
}

export type FilterValue =
  | string
  | number
  | boolean
  | RangeFilterValue
  | null
  | undefined;

export type Filters<T> = Partial<Record<keyof T, FilterValue>>;
export type RowAction = "view" | "edit" | "delete";
export interface RowActionConfig<T> {
  key: RowAction;
  label?: string;
  variant?: "default" | "danger";
  onClick: (row: T) => void;
}

export interface DynamicTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pageSize?: number;
  mode?: "client" | "server";
  totalEntries?: number;
  onQueryChange?: (state: TableQueryState<T>) => void;
  searchPlaceholder?: string;
  filtersConfig?: FilterConfig<T>[];
  actions?: RowActionConfig<T>[];
  highlightedRowKeys?: string[];
}
