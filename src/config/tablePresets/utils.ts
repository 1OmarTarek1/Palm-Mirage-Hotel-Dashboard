import { Column, FilterConfig } from "@/components/shared/table/types";

/**
 * Helper to strongly type and associate a set of columns with its filters
 * Ensures the filters use the same generic type as the columns.
 */
export function createTablePreset<T>(
  columns: Column<T>[],
  filters: FilterConfig<T>[] = []
) {
  return { columns, filters };
}
