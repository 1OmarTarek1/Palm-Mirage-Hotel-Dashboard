import {
  Column,
  FilterConfig,
  Filters,
  FilterValue,
  SortConfig,
} from "../../types";

export interface MobileDrawerSectionProps<T> {
  filters: Filters<T>;
  sortConfig: SortConfig<T> | null;
  expandedSections: Record<string, boolean>;
  onToggleSection: (sectionKey: string) => void;
  onFilterChange: (key: keyof T, value: FilterValue) => void;
  onSortColumnChange: (value: string) => void;
  onSortDirectionToggle: () => void;
  onRangeChange: (key: keyof T, field: "min" | "max", value: string) => void;
}

export interface MobileFiltersDrawerProps<T> extends MobileDrawerSectionProps<T> {
  isMounted: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sortableColumns: Column<T>[];
  filtersConfig: FilterConfig<T>[];
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onReset?: () => void;
}
