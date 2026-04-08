import React from "react";
import { Column } from "./types";
import CellRenderer from "./CellRenderer";
import { resolveRowKey, resolveValue } from "./utils";

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  startIndex: number;
  isLoading?: boolean;
  skeletonRowCount?: number;
  highlightedRowKeys?: string[];
}

export default function TableBody<T extends object>({
  data,
  columns,
  startIndex,
  isLoading = false,
  skeletonRowCount = 5,
  highlightedRowKeys = [],
}: TableBodyProps<T>) {
  const getCellAlignmentClass = (align?: Column<T>["cellAlign"]) => {
    if (align === "left") return "text-left";
    if (align === "right") return "text-right";
    return "text-center";
  };

  return (
    <tbody className="divide-y divide-border/70">
      {isLoading ? (
        Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
          <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
            {columns.map((col, colIndex) => (
              <td
                key={`${String(col.key)}-${colIndex}`}
                className={`px-6 py-4 align-middle font-main text-[13.5px] font-medium text-foreground/80 ${getCellAlignmentClass(col.cellAlign)}`}
              >
                {col.type === "image-card" ? (
                  <div className={`flex items-center gap-3 ${col.cellAlign === "left" ? "justify-start" : col.cellAlign === "right" ? "justify-end" : "justify-center"}`}>
                    <div className="h-16 w-24 shrink-0 rounded-2xl bg-muted" />
                    <div className="min-w-0 space-y-2">
                      <div className="h-3.5 w-32 rounded-full bg-muted" />
                      <div className="h-3 w-24 rounded-full bg-accent" />
                    </div>
                  </div>
                ) : col.type === "action-dropdown" ? (
                  <div className={`${col.cellAlign === "left" ? "" : col.cellAlign === "right" ? "ml-auto" : "mx-auto"} h-8 w-8 rounded-lg bg-muted`} />
                ) : (
                  <div className={`${col.cellAlign === "left" ? "" : col.cellAlign === "right" ? "ml-auto" : "mx-auto"} h-4 w-20 rounded-full bg-muted`} />
                )}
              </td>
            ))}
          </tr>
        ))
      ) : data.length === 0 ? (
        <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-12 text-center font-main text-sm text-muted-foreground"
            >
              No data available matching your criteria
            </td>
        </tr>
      ) : (
        data.map((row, rowIndex) => (
          (() => {
            const rowKey = resolveRowKey(row, startIndex + rowIndex);
            const isHighlighted = highlightedRowKeys.includes(rowKey);

            return (
          <tr
            key={rowKey}
            className={`group transition-all duration-700 hover:bg-muted/35 ${
              isHighlighted
                ? "bg-primary/10 shadow-[inset_4px_0_0_0_color-mix(in_srgb,var(--primary)_72%,transparent)] animate-[pulse_1.6s_ease-in-out_2]"
                : ""
            }`}
          >
            {columns.map((col) => (
              <td key={String(col.key)} className={`px-6 py-4 align-middle font-main text-[13.5px] font-medium text-foreground/80 ${getCellAlignmentClass(col.cellAlign)}`}>
                <CellRenderer 
                  row={row} 
                  column={col} 
                  resolvedValue={resolveValue(row, col)} 
                />
              </td>
            ))}
          </tr>
            );
          })()
        ))
      )}
    </tbody>
  );
}
