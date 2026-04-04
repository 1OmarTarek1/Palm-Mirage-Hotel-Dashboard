"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Column, DynamicTableProps, FilterValue, Filters, RangeFilterValue, SortConfig } from "./types";
import { resolveRowKey, resolveSortValue, resolveValue } from "./utils";
import SearchBar from "./SearchBar";
import FiltersPanel from "./FiltersPanel";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import MobileCard, { MobileCardSkeleton } from "./MobileCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DynamicTable<T extends object>({
  columns,
  data,
  isLoading = false,
  pageSize: initialPageSize = 10,
  searchPlaceholder = "Search...",
  filtersConfig = [],
  actions,
}: DynamicTableProps<T>) {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters<T>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 96;

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filterKey]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((key: keyof T, value: FilterValue) => {
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

  const handleMobileSortChange = useCallback((value: string) => {
    if (value === "__default__") {
      setSortConfig(null);
      return;
    }

    const nextKey = value as Column<T>["key"];

    setSortConfig((prev) => {
      if (prev?.key === nextKey) {
        return prev;
      }

      return {
        key: nextKey,
        direction: "asc",
      };
    });
  }, []);

  const handleSortDirectionToggle = useCallback(() => {
    setSortConfig((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        direction: prev.direction === "asc" ? "desc" : "asc",
      };
    });
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (page === currentPage) return;

    setCurrentPage(page);

    window.requestAnimationFrame(() => {
      const container = tableContainerRef.current;
      if (!container) return;

      const nextTop = Math.max(window.scrollY + container.getBoundingClientRect().top - scrollOffset, 0);
      window.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
    });
  }, [currentPage]);

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
        return Object.values(val).some((value) => value !== "" && value !== undefined && value !== null);
      }

      return val !== "" && val !== undefined && val !== null;
    });
    const hasSort = sortConfig !== null;

    return hasSearch || hasColumnFilters || hasSort;
  }, [searchTerm, filters, sortConfig]);

  const filteredData = useMemo(() => {
    let result = [...data];

    const q = debouncedSearchTerm.trim().toLowerCase();
    if (q) {
      const searchableKeys = columns.filter((column) => column.searchable).map((column) => column.key);

      if (searchableKeys.length > 0) {
        result = result.filter((row) =>
          searchableKeys.some((key) => {
            const column = columns.find((item) => item.key === key);
            if (!column) return false;

            return String(resolveValue(row, column) ?? "")
              .toLowerCase()
              .includes(q);
          })
        );
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key as keyof T];
      const filterConfig = filtersConfig.find((filter) => filter.key === key);
      const column = columns.find((item) => item.key === key);
      if (!filterConfig) return;

      if (filterConfig.type === "select" && value !== "") {
        result = result.filter((row) => {
          const rowValue = column ? resolveValue(row, column) : row[key as keyof T];
          return String(rowValue) === String(value);
        });
      } else if (filterConfig.type === "range") {
        const range = value as RangeFilterValue;
        const hasMin = range?.min !== undefined && range?.min !== "";
        const hasMax = range?.max !== undefined && range?.max !== "";

        if (!hasMin && !hasMax) return;

        let minValue = hasMin ? Number(range.min) : -Infinity;
        let maxValue = hasMax ? Number(range.max) : Infinity;

        if (hasMin && hasMax && minValue > maxValue) {
          const temp = minValue;
          minValue = maxValue;
          maxValue = temp;
        }

        result = result.filter((row) => {
          const rowValue = Number(column ? resolveValue(row, column) : row[key as keyof T]);
          if (isNaN(rowValue)) return false;
          if (hasMin && rowValue < minValue) return false;
          if (hasMax && rowValue > maxValue) return false;
          return true;
        });
      }
    });

    return result;
  }, [data, debouncedSearchTerm, filters, filtersConfig, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const column = columns.find((item) => item.key === sortConfig.key);

    return [...filteredData].sort((a, b) => {
      const aValue = column
        ? resolveSortValue(a, column)
        : (a as Record<string, unknown>)[String(sortConfig.key)];
      const bValue = column
        ? resolveSortValue(b, column)
        : (b as Record<string, unknown>)[String(sortConfig.key)];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue ?? "").toLowerCase();
      const bString = String(bValue ?? "").toLowerCase();
      const comparison = aString.localeCompare(bString);

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, columns]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const mobileSkeletonDetailCount = useMemo(() => {
    const dataColumns = computedColumns.filter((column) => column.type !== "action-dropdown");
    return Math.max(2, Math.min(4, Math.max(dataColumns.length - 1, 1)));
  }, [computedColumns]);
  const hasFilterPanel = filtersConfig.length > 0 || columns.some((column) => column.sortable);
  const showControlSkeleton = isLoading && data.length === 0 && !hasActiveFilters && searchTerm.length === 0;

  const totalPages = isLoading ? 1 : Math.max(1, Math.ceil(sortedData.length / pageSize));

  return (
    <div ref={tableContainerRef} className="w-full">
      <div className="sticky top-16 z-30 rounded-t-[28px] border-b border-border bg-card/95 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {showControlSkeleton ? (
              <>
                <Skeleton className="h-10 flex-1 rounded-full lg:max-w-md xl:max-w-sm" />
                {hasFilterPanel ? (
                  <>
                    <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
                      <Skeleton className="h-10 w-32 rounded-2xl" />
                      <Skeleton className="h-10 w-28 rounded-2xl" />
                      <Skeleton className="h-10 w-24 rounded-2xl" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-2xl lg:hidden" />
                  </>
                ) : null}
              </>
            ) : (
              <>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  placeholder={searchPlaceholder}
                  className="flex-1"
                />

                {hasFilterPanel ? (
                  <FiltersPanel
                    columns={columns}
                    filtersConfig={filtersConfig}
                    filters={filters}
                    sortConfig={sortConfig}
                    onFilterChange={handleFilterChange}
                    onSortColumnChange={handleMobileSortChange}
                    onSortDirectionToggle={handleSortDirectionToggle}
                    hasActiveFilters={hasActiveFilters}
                    onReset={handleReset}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-3 lg:hidden">
        <div className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_32%),var(--color-card)] p-3 shadow-inner shadow-black/[0.03]">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: pageSize }).map((_, index) => (
                <MobileCardSkeleton
                  key={`mobile-card-skeleton-${index}`}
                  detailCount={mobileSkeletonDetailCount}
                />
              ))}
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border bg-muted/20 px-5 py-10 text-center font-main text-sm text-muted-foreground">
              No data available matching your criteria
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedData.map((row, rowIndex) => (
                <MobileCard
                  key={resolveRowKey(row, (currentPage - 1) * pageSize + rowIndex)}
                  row={row}
                  columns={computedColumns}
                  itemNumber={(currentPage - 1) * pageSize + rowIndex + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden max-h-[36rem] overflow-auto bg-card/30 lg:block">
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

      {showControlSkeleton ? (
        <div className="flex flex-col gap-4 rounded-b-[28px] border-t border-border px-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-48 rounded-full" />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalEntries={isLoading ? pageSize : sortedData.length}
        />
      )}
    </div>
  );
}
