"use client";

import React from "react";
import { Filter as FilterIcon, RotateCcw } from "lucide-react";
import { FilterConfig } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersPanelProps<T> {
  filtersConfig: FilterConfig<T>[];
  filters: Partial<Record<keyof T, any>>;
  onFilterChange: (key: keyof T, value: any) => void;
  hasActiveFilters?: boolean;
  onReset?: () => void;
}

const FiltersPanel = <T,>({
  filtersConfig,
  filters,
  onFilterChange,
  hasActiveFilters = false,
  onReset,
}: FiltersPanelProps<T>) => {
  if (filtersConfig.length === 0) return null;

  const handleRangeChange = (key: keyof T, field: "min" | "max", value: string) => {
    if (value === "") {
      onFilterChange(key, { ...filters[key], [field]: "" });
      return;
    }

    const numVal = Number(value);
    if (isNaN(numVal) || numVal < 0) return; // Disallow negative numbers

    onFilterChange(key, { ...filters[key], [field]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={hasActiveFilters ? onReset : undefined}
        aria-label={hasActiveFilters ? "Reset filters" : "Filters"}
        title={hasActiveFilters ? "Reset filters" : "Filters"}
        className={`mr-2 flex items-center gap-2 transition-all ${
          hasActiveFilters
            ? "group cursor-pointer text-muted-foreground hover:text-primary"
            : "cursor-default text-muted-foreground"
        }`}
      >
        {hasActiveFilters ? (
          <RotateCcw
            size={16}
            className="transition-transform duration-500 group-hover:-rotate-180"
          />
        ) : (
          <FilterIcon size={16} />
        )}
      </button>

      {filtersConfig.map((f) => (
        <div key={String(f.key)} className="flex items-center gap-2">
          {f.type === "select" ? (
            <Select
              value={filters[f.key] ? String(filters[f.key]) : "__all__"}
              onValueChange={(value) =>
                onFilterChange(f.key, value === "__all__" ? "" : value)
              }
            >
              <SelectTrigger className="h-10 min-w-40 rounded-xl px-3 py-2 text-xs font-medium">
                <SelectValue placeholder={`All ${f.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All {f.label}</SelectItem>
                {f.options?.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : f.type === "range" ? (
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5 shadow-sm">
              <span className="font-header text-[10px] font-bold uppercase text-muted-foreground/70">
                {f.label}:
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters[f.key]?.min || ""}
                onChange={(e) => handleRangeChange(f.key, "min", e.target.value)}
                className="w-16 rounded-md bg-transparent px-1 font-main text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:bg-muted/50"
              />
              <span className="text-muted-foreground/70">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters[f.key]?.max || ""}
                onChange={(e) => handleRangeChange(f.key, "max", e.target.value)}
                className="w-16 rounded-md bg-transparent px-1 font-main text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:bg-muted/50"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default FiltersPanel;
