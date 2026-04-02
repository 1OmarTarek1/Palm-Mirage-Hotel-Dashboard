"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import DesktopFiltersRow from "./filters-panel/DesktopFiltersRow";
import MobileFiltersDrawer from "./filters-panel/MobileFiltersDrawer";
import {
  Column,
  Filters,
  FilterConfig,
  FilterValue,
  SortConfig,
} from "./types";
import { buildExpandedMap, getRangeFilterValue, isFilterActive } from "./filters-panel/utils";

interface FiltersPanelProps<T> {
  columns: Column<T>[];
  filtersConfig: FilterConfig<T>[];
  filters: Filters<T>;
  sortConfig: SortConfig<T> | null;
  onFilterChange: (key: keyof T, value: FilterValue) => void;
  onSortColumnChange: (value: string) => void;
  onSortDirectionToggle: () => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
}

const FiltersPanel = <T,>({
  columns,
  filtersConfig,
  filters,
  sortConfig,
  onFilterChange,
  onSortColumnChange,
  onSortDirectionToggle,
  hasActiveFilters = false,
  onReset,
}: FiltersPanelProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    buildExpandedMap(filtersConfig, filters)
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    desktopMediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isOpen]);

  useEffect(() => {
    setExpandedSections((current) => {
      if (Object.keys(current).length === filtersConfig.length + 1) {
        return current;
      }

      return buildExpandedMap(filtersConfig, filters);
    });
  }, [filters, filtersConfig]);

  const activeFiltersCount = useMemo(() => {
    return filtersConfig.filter((config) => isFilterActive(config, filters)).length;
  }, [filters, filtersConfig]);

  const sortableColumns = useMemo(() => {
    return columns.filter((column) => column.sortable);
  }, [columns]);

  if (filtersConfig.length === 0 && sortableColumns.length === 0) return null;

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }));
  };

  const handleRangeChange = (key: keyof T, field: "min" | "max", value: string) => {
    const rangeValue = getRangeFilterValue(filters, key);

    if (value === "") {
      onFilterChange(key, { ...rangeValue, [field]: "" });
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 0) return;

    onFilterChange(key, { ...rangeValue, [field]: value });
  };

  return (
    <>
      <DesktopFiltersRow
        filtersConfig={filtersConfig}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={onFilterChange}
        onReset={onReset}
        onRangeChange={handleRangeChange}
      />

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open filters"
          title="Open filters"
          className={cn(
            "relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
            activeFiltersCount > 0 && "border-primary/30 bg-primary/5 text-primary"
          )}
        >
          <SlidersHorizontal size={18} />
          {activeFiltersCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-main text-[10px] font-bold text-primary-foreground shadow-md">
              {activeFiltersCount}
            </span>
          ) : null}
        </button>

        <MobileFiltersDrawer
          isMounted={isMounted}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          sortableColumns={sortableColumns}
          filtersConfig={filtersConfig}
          filters={filters}
          sortConfig={sortConfig}
          activeFiltersCount={activeFiltersCount}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onFilterChange={onFilterChange}
          onSortColumnChange={onSortColumnChange}
          onSortDirectionToggle={onSortDirectionToggle}
          onRangeChange={handleRangeChange}
          hasActiveFilters={hasActiveFilters}
          onReset={onReset}
        />
      </div>
    </>
  );
};

export default FiltersPanel;
