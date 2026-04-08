"use client";

import React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  FilterConfig,
  Filters,
  FilterValue,
} from "../types";
import { getRangeFilterValue } from "./utils";

interface DesktopFiltersRowProps<T> {
  filtersConfig: FilterConfig<T>[];
  filters: Filters<T>;
  hasActiveFilters: boolean;
  onFilterChange: (key: keyof T, value: FilterValue) => void;
  onReset?: () => void;
  onRangeChange: (key: keyof T, field: "min" | "max", value: string) => void;
}

export default function DesktopFiltersRow<T>({
  filtersConfig,
  filters,
  hasActiveFilters,
  onFilterChange,
  onReset,
  onRangeChange,
}: DesktopFiltersRowProps<T>) {
  return (
    <div className="hidden flex-wrap items-center gap-3 lg:ml-auto lg:flex lg:justify-end">
      <button
        type="button"
        onClick={hasActiveFilters ? onReset : undefined}
        aria-label={hasActiveFilters ? "Reset filters" : "Filters"}
        title={hasActiveFilters ? "Reset filters" : "Filters"}
        className={cn(
          "mr-2 flex items-center gap-2 transition-all",
          hasActiveFilters
            ? "group cursor-pointer text-muted-foreground hover:text-primary"
            : "cursor-default text-muted-foreground"
        )}
      >
        {hasActiveFilters ? (
          <RotateCcw
            size={16}
            className="transition-transform duration-500 group-hover:-rotate-180"
          />
        ) : (
          <SlidersHorizontal size={16} />
        )}
      </button>

      {filtersConfig.map((config) => (
        <div key={String(config.key)} className="flex items-center gap-2">
          {config.type === "select" ? (
            <Select
              value={filters[config.key] ? String(filters[config.key]) : "__all__"}
              onValueChange={(value) =>
                onFilterChange(config.key, value === "__all__" ? "" : value)
              }
            >
              <SelectTrigger className="h-11 min-w-40 cursor-pointer rounded-xl px-3 text-xs font-medium">
                <SelectValue placeholder={`All ${config.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All {config.label}</SelectItem>
                {config.options?.map((option) => (
                  <SelectItem key={String(option.value)} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex min-h-11 items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5 shadow-sm">
              <span className="font-header text-[10px] font-bold uppercase text-muted-foreground/70">
                {config.label}:
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={getRangeFilterValue(filters, config.key).min || ""}
                onChange={(event) =>
                  onRangeChange(config.key, "min", event.target.value)
                }
                className="h-8 w-16 rounded-md bg-transparent px-1 font-main text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:bg-muted/50"
              />
              <span className="text-muted-foreground/70">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={getRangeFilterValue(filters, config.key).max || ""}
                onChange={(event) =>
                  onRangeChange(config.key, "max", event.target.value)
                }
                className="h-8 w-16 rounded-md bg-transparent px-1 font-main text-xs text-foreground outline-none placeholder:text-muted-foreground/70 focus:bg-muted/50"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
