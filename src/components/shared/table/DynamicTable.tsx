"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw } from "lucide-react";

import { Column, DynamicTableProps, SortConfig, Filters } from "./types";
import { resolveSortValue, resolveValue } from "./utils";

// Components
import SearchBar from "./SearchBar";
import FiltersPanel from "./FiltersPanel";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";

/**
 * DynamicTable Component
 * Modular, Scalable, and High-Performance.
 * Strict Pipeline: Filter -> Sort -> Paginate
 */
export default function DynamicTable<T extends object>({
  columns,
  data,
  isLoading = false,
  pageSize: initialPageSize = 10,
  searchPlaceholder = "Search...",
  filtersConfig = [],
  actions,
}: DynamicTableProps<T>) {
  // ─── Computed Columns (Actions Integration) ───────────────────────────────
  const enabledActions = useMemo(() => {
    if (!actions || actions.length === 0) return [];

    return actions.filter((action) => typeof action.onClick === "function");
  }, [actions]);

  const computedColumns = useMemo(() => {
    const hasActions = enabledActions.length > 0;
    if (!hasActions) return columns;

    const actionColumn: Column<T> = {
      key: "__actions",
      title: "Actions",
      type: "action-dropdown",
      config: { actions: enabledActions },
    } as Column<T>;

    return [...columns, actionColumn];
  }, [columns, enabledActions]);
  // ─── State Management ───────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters<T>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const previousPageRef = useRef(currentPage);

  // Stable filter key to avoid JSON.stringify re-render issue
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  // Reset pagination to first page when search or filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filterKey]);

  useEffect(() => {
    if (previousPageRef.current !== currentPage) {
      tableContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    previousPageRef.current = currentPage;
  }, [currentPage]);

  // ─── Handlers (Memoized) ───────────────────────────────────────────────────

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((key: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSort = useCallback((col: Column<T>) => {
    if (!col.sortable) return;
    setSortConfig((prev) => {
      if (prev?.key === col.key) {
        return {
          key: col.key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key: col.key, direction: "asc" };
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilters({});
    setSortConfig(null);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = searchTerm.trim().length > 0;
    const hasColumnFilters = Object.values(filters).some((val) => {
      if (typeof val === "object" && val !== null) {
        return Object.values(val).some((v) => v !== "" && v !== undefined && v !== null);
      }
      return val !== "" && val !== undefined && val !== null;
    });
    const hasSort = sortConfig !== null;
    return hasSearch || hasColumnFilters || hasSort;
  }, [searchTerm, filters, sortConfig]);

  // ─── Data Pipeline (Memoized) ──────────────────────────────────────────────

  // 1. Filtered Data (Search + Columns)
  const filteredData = useMemo(() => {
    let result = [...data];

    // Global Search
    const q = debouncedSearchTerm.trim().toLowerCase();
    if (q) {
      const searchableKeys = columns
        .filter((c) => c.searchable)
        .map((c) => c.key);
      if (searchableKeys.length > 0) {
        result = result.filter((row) =>
          searchableKeys.some((key) => {
            const col = columns.find((c) => c.key === key);
            if (!col) return false;
            return String(resolveValue(row, col) ?? "")
              .toLowerCase()
              .includes(q);
          })
        );
      }
    }

    // Column Filters
    Object.keys(filters).forEach((key) => {
      const val = filters[key as keyof T];
      const config = filtersConfig.find((f) => f.key === key);
      const col = columns.find((c) => c.key === key);
      if (!config) return;

      if (config.type === "select" && val !== "") {
        result = result.filter((row) => {
          const rowVal = col ? resolveValue(row, col) : row[key as keyof T];
          return String(rowVal) === String(val);
        });
      } else if (config.type === "range") {
        const range = val as { min?: number | string; max?: number | string };
        const hasMin = range?.min !== undefined && range?.min !== "";
        const hasMax = range?.max !== undefined && range?.max !== "";
        
        if (!hasMin && !hasMax) return;

        let minVal = hasMin ? Number(range.min) : -Infinity;
        let maxVal = hasMax ? Number(range.max) : Infinity;

        // Auto-swap if accidentally inverted
        if (hasMin && hasMax && minVal > maxVal) {
          const temp = minVal;
          minVal = maxVal;
          maxVal = temp;
        }

        result = result.filter((row) => {
          const rowVal = Number(col ? resolveValue(row, col) : row[key as keyof T]);
          if (isNaN(rowVal)) return false;
          if (hasMin && rowVal < minVal) return false;
          if (hasMax && rowVal > maxVal) return false;
          return true;
        });
      }
    });

    return result;
  }, [data, debouncedSearchTerm, filters, filtersConfig, columns]);

  // 2. Sorted Data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const col = columns.find((c) => c.key === sortConfig.key);

    return [...filteredData].sort((a, b) => {
      const aVal = col ? resolveSortValue(a, col) : a[sortConfig.key];
      const bVal = col ? resolveSortValue(b, col) : b[sortConfig.key];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal ?? "").toLowerCase();
      const bStr = String(bVal ?? "").toLowerCase();
      const cmp = aStr.localeCompare(bStr);
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortConfig, columns]);

  // 3. Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = isLoading ? 1 : Math.max(1, Math.ceil(sortedData.length / pageSize));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={tableContainerRef} className="w-full">
      {/* Top Controls: Search + Filters */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-1 items-center gap-4 min-w-75">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            placeholder={searchPlaceholder}
          />

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="group flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-bold text-gray-500 transition-all hover:text-indigo-600"
            >
              <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
              Reset
            </button>
          )}
        </div>

        {/* Filters Panel - Now aligned to the right */}
        {filtersConfig.length > 0 && (
          <div className="flex items-center">
            <FiltersPanel
              filtersConfig={filtersConfig}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <TableHeader
            columns={computedColumns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <TableBody
            data={paginatedData}
            columns={computedColumns}
            startIndex={(currentPage - 1) * pageSize}
            isLoading={isLoading}
            skeletonRowCount={pageSize}
          />
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        totalEntries={isLoading ? pageSize : sortedData.length}
      />
    </div>
  );
}
