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
  colKey: keyof T;
  sortConfig: SortConfig<T> | null;
}) {
  if (!sortConfig || sortConfig.key !== colKey)
    return (
      <ChevronsUpDown size={13} className="ml-1 inline-block text-gray-300" />
    );
  return sortConfig.direction === "asc" ? (
    <ChevronUp size={13} className="ml-1 inline-block text-indigo-600" />
  ) : (
    <ChevronDown size={13} className="ml-1 inline-block text-indigo-600" />
  );
}

export default function TableHeader<T>({
  columns,
  sortConfig,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-white">
        {columns.map((col, index) => (
          <th
            key={String(col.key)}
            onClick={() => onSort(col)}
            className={`px-6 py-5 select-none text-center text-[13px] font-bold text-gray-900 border-b border-gray-100/80
              ${
                col.sortable
                  ? "cursor-pointer transition-colors hover:text-indigo-600"
                  : ""
              }
            `}
          >
            <span className="inline-flex items-center justify-center">
              {col.title}
              {col.sortable && (
                <SortIcon colKey={col.key as keyof T} sortConfig={sortConfig} />
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}
