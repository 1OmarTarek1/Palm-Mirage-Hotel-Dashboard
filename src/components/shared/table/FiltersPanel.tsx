"use client";

import React from "react";
import { Filter as FilterIcon } from "lucide-react";
import { FilterConfig } from "./types";

interface FiltersPanelProps<T> {
  filtersConfig: FilterConfig<T>[];
  filters: Partial<Record<keyof T, any>>;
  onFilterChange: (key: keyof T, value: any) => void;
}

const FiltersPanel = <T,>({
  filtersConfig,
  filters,
  onFilterChange,
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
      <div className="mr-2 flex items-center gap-2 text-gray-400">
        <FilterIcon size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Filters
        </span>
      </div>

      {filtersConfig.map((f) => (
        <div key={String(f.key)} className="flex items-center gap-2">
          {f.type === "select" ? (
            <select
              value={filters[f.key] || ""}
              onChange={(e) => onFilterChange(f.key, e.target.value)}
              className="rounded-lg border border-gray-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
            >
              <option value="">All {f.label}</option>
              {f.options?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : f.type === "range" ? (
            <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-white px-2 py-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-gray-300">
                {f.label}:
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={filters[f.key]?.min || ""}
                onChange={(e) => handleRangeChange(f.key, "min", e.target.value)}
                className="w-16 bg-transparent text-xs outline-none placeholder:text-gray-300"
              />
              <span className="text-gray-300">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={filters[f.key]?.max || ""}
                onChange={(e) => handleRangeChange(f.key, "max", e.target.value)}
                className="w-16 bg-transparent text-xs outline-none placeholder:text-gray-300"
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default FiltersPanel;
