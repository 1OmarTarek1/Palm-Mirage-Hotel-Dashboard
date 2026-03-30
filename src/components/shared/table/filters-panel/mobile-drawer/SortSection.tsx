"use client";

import React from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Column } from "../../types";
import { MobileDrawerSectionProps } from "./types";

interface SortSectionProps<T> extends MobileDrawerSectionProps<T> {
  sortableColumns: Column<T>[];
}

export default function SortSection<T>({
  sortableColumns,
  sortConfig,
  expandedSections,
  onToggleSection,
  onSortColumnChange,
  onSortDirectionToggle,
}: SortSectionProps<T>) {
  if (sortableColumns.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[20px] border border-sidebar-border bg-sidebar-accent/55">
      <button
        type="button"
        onClick={() => onToggleSection("__sort__")}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-3.5 text-left transition-colors hover:bg-sidebar-accent"
      >
        <div className="min-w-0">
          <span className="block font-header text-[11px] font-black uppercase tracking-[0.18em] text-sidebar-foreground">
            Sort
          </span>
          <span className="mt-1 block truncate font-main text-xs text-sidebar-accent-foreground">
            {sortConfig
              ? `${String(sortConfig.key)} • ${sortConfig.direction}`
              : "Default order"}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-sidebar-accent-foreground transition-transform duration-200",
            expandedSections.__sort__ && "rotate-180"
          )}
        />
      </button>

      {expandedSections.__sort__ ? (
        <div className="space-y-2.5 border-t border-sidebar-border/70 px-3.5 py-3.5">
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onSortColumnChange("__default__")}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                !sortConfig
                  ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                  : "border-sidebar-border bg-sidebar text-sidebar-foreground hover:border-sidebar-primary/40"
              )}
            >
              <span className="font-main text-sm font-semibold">Default order</span>
              {!sortConfig ? (
                <span className="font-main text-[10px] font-black uppercase tracking-[0.18em]">
                  Active
                </span>
              ) : null}
            </button>

            {sortableColumns.map((column) => {
              const isSelected = sortConfig?.key === column.key;

              return (
                <button
                  key={String(column.key)}
                  type="button"
                  onClick={() => onSortColumnChange(String(column.key))}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                    isSelected
                      ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                      : "border-sidebar-border bg-sidebar text-sidebar-foreground hover:border-sidebar-primary/40"
                  )}
                >
                  <span className="font-main text-sm font-semibold">
                    {column.title}
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSortDirectionToggle}
            disabled={!sortConfig}
            className="h-10 w-full rounded-xl"
          >
            {sortConfig ? (
              sortConfig.direction === "asc" ? (
                <ArrowUp className="size-4" />
              ) : (
                <ArrowDown className="size-4" />
              )
            ) : (
              <SlidersHorizontal className="size-4" />
            )}
            {sortConfig
              ? sortConfig.direction === "asc"
                ? "Ascending"
                : "Descending"
              : "Choose a sort field"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
