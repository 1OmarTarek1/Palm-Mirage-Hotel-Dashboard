"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterConfig } from "../../types";
import {
  getFilterSummary,
  getRangeFilterValue,
  isFilterActive,
} from "../utils";
import { MobileDrawerSectionProps } from "./types";

interface FilterSectionProps<T> extends MobileDrawerSectionProps<T> {
  config: FilterConfig<T>;
}

export default function FilterSection<T>({
  config,
  filters,
  expandedSections,
  onToggleSection,
  onFilterChange,
  onRangeChange,
}: FilterSectionProps<T>) {
  const sectionKey = String(config.key);
  const isExpanded = expandedSections[sectionKey];
  const summary = getFilterSummary(config, filters);

  return (
    <section className="overflow-hidden rounded-[20px] border border-sidebar-border bg-primary/6">
      <button
        type="button"
        onClick={() => onToggleSection(sectionKey)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-primary/7"
      >
        <div className="min-w-0">
          <span className="block font-header text-[11px] font-black uppercase tracking-[0.18em] text-sidebar-foreground">
            {config.label}
          </span>
          <span className="mt-1 block truncate font-main text-xs text-sidebar-accent-foreground">
            {summary}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-sidebar-accent-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-sidebar-border/70 px-3.5 py-3.5">
          {config.type === "select" ? (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onFilterChange(config.key, "")}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                  !isFilterActive(config, filters)
                    ? "border-primary/20 bg-primary/8 text-sidebar-foreground"
                    : "border-sidebar-border bg-sidebar text-sidebar-foreground/75 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/85"
                )}
              >
                <span className="font-main text-sm font-semibold">
                  All {config.label}
                </span>
                {!isFilterActive(config, filters) ? (
                  <span className="font-main text-[10px] font-black uppercase tracking-[0.18em]">
                    Active
                  </span>
                ) : null}
              </button>

              {config.options?.map((option) => {
                const isSelected =
                  String(filters[config.key] ?? "") === String(option.value);

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    onClick={() => onFilterChange(config.key, option.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                      isSelected
                        ? "border-primary/20 bg-primary/8 text-sidebar-foreground"
                        : "border-sidebar-border bg-sidebar text-sidebar-foreground/75 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/85"
                    )}
                  >
                    <span className="font-main text-sm font-semibold">
                      {option.label}
                    </span>
                    {isSelected ? (
                      <span className="font-main text-[10px] font-black uppercase tracking-[0.18em]">
                        Active
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="block font-header text-[10px] font-black uppercase tracking-[0.18em] text-sidebar-accent-foreground">
                  Min
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={getRangeFilterValue(filters, config.key).min || ""}
                  onChange={(event) =>
                    onRangeChange(config.key, "min", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-sidebar-border bg-sidebar px-3.5 font-main text-sm font-medium text-sidebar-foreground outline-none transition-colors placeholder:text-sidebar-accent-foreground focus:border-sidebar-primary"
                />
              </label>

              <label className="space-y-2">
                <span className="block font-header text-[10px] font-black uppercase tracking-[0.18em] text-sidebar-accent-foreground">
                  Max
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="Any"
                  value={getRangeFilterValue(filters, config.key).max || ""}
                  onChange={(event) =>
                    onRangeChange(config.key, "max", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-sidebar-border bg-sidebar px-3.5 font-main text-sm font-medium text-sidebar-foreground outline-none transition-colors placeholder:text-sidebar-accent-foreground focus:border-sidebar-primary"
                />
              </label>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
