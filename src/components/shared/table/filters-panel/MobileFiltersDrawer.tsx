"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DrawerHeader from "./mobile-drawer/DrawerHeader";
import DrawerShell from "./mobile-drawer/DrawerShell";
import FilterSection from "./mobile-drawer/FilterSection";
import SortSection from "./mobile-drawer/SortSection";
import { MobileFiltersDrawerProps } from "./mobile-drawer/types";

export default function MobileFiltersDrawer<T>({
  isMounted,
  isOpen,
  setIsOpen,
  sortableColumns,
  filtersConfig,
  filters,
  sortConfig,
  activeFiltersCount,
  expandedSections,
  onToggleSection,
  onFilterChange,
  onSortColumnChange,
  onSortDirectionToggle,
  onRangeChange,
  hasActiveFilters,
  onReset,
}: MobileFiltersDrawerProps<T>) {
  return (
    <DrawerShell
      isMounted={isMounted}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <DrawerHeader
        activeFiltersCount={activeFiltersCount}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex-1 overflow-y-auto overscroll-y-contain px-3 py-3">
        <div className="space-y-2.5">
          <SortSection
            sortableColumns={sortableColumns}
            filters={filters}
            sortConfig={sortConfig}
            expandedSections={expandedSections}
            onToggleSection={onToggleSection}
            onFilterChange={onFilterChange}
            onSortColumnChange={onSortColumnChange}
            onSortDirectionToggle={onSortDirectionToggle}
            onRangeChange={onRangeChange}
          />

          {filtersConfig.map((config) => (
            <FilterSection
              key={String(config.key)}
              config={config}
              filters={filters}
              sortConfig={sortConfig}
              expandedSections={expandedSections}
              onToggleSection={onToggleSection}
              onFilterChange={onFilterChange}
              onSortColumnChange={onSortColumnChange}
              onSortDirectionToggle={onSortDirectionToggle}
              onRangeChange={onRangeChange}
            />
          ))}
        </div>
      </div>

      <footer className="flex items-center gap-2.5 border-t border-sidebar-border px-3 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="h-10 flex-1 rounded-xl border-sidebar-border bg-sidebar text-sidebar-foreground hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground disabled:opacity-40"
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>

        <Button
          type="button"
          variant="palmPrimary"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-10 flex-1 rounded-xl border border-primary/20 bg-primary/8 text-sidebar-foreground hover:bg-primary/12 hover:text-sidebar-foreground"
        >
          Done
        </Button>
      </footer>
    </DrawerShell>
  );
}
