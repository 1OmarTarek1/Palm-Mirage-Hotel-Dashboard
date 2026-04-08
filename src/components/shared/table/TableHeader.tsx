"use client";

import React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Column, SortConfig } from "./types";

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig: SortConfig<T> | null;
  onSort: (column: Column<T>) => void;
}

function SortIcon<T>({
  colKey,
  sortConfig,
}: {
  colKey: Column<T>["key"];
  sortConfig: SortConfig<T> | null;
}) {
  if (!sortConfig || sortConfig.key !== colKey)
    return (
      <ChevronsUpDown size={13} className="ml-1 inline-block text-muted-foreground/50" />
    );
  return sortConfig.direction === "asc" ? (
    <ChevronUp size={13} className="ml-1 inline-block text-primary" />
  ) : (
    <ChevronDown size={13} className="ml-1 inline-block text-primary" />
  );
}

export default function TableHeader<T>({
  columns,
  sortConfig,
  onSort,
}: TableHeaderProps<T>) {
  const getHeaderAlignmentClassName = (alignment?: Column<T>["headerAlign"]) => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const getHeaderContentAlignmentClassName = (alignment?: Column<T>["headerAlign"]) => {
    switch (alignment) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  return (
    <thead className="sticky top-0 z-20">
      <tr className="bg-card/95 shadow-[inset_0_-1px_0_0_color-mix(in_srgb,var(--color-border)_88%,transparent)] backdrop-blur-md">
        {columns.map((col) => (
          <th
            key={String(col.key)}
            onClick={() => onSort(col)}
            className={`overflow-hidden px-6 py-5 font-header text-[13px] font-bold uppercase tracking-[0.14em] text-foreground/90 select-none ${getHeaderAlignmentClassName(col.headerAlign)}
              ${
                col.sortable
                  ? "cursor-pointer transition-colors hover:text-primary"
                  : ""
              }
            `}
          >
            <span className={`inline-flex items-center ${getHeaderContentAlignmentClassName(col.headerAlign)}`}>
              {col.title}
              {col.sortable && (
                <SortIcon colKey={col.key} sortConfig={sortConfig} />
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}
