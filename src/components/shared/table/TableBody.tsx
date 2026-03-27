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
}

export default function TableBody<T extends object>({
  data,
  columns,
  startIndex,
  isLoading = false,
  skeletonRowCount = 5,
}: TableBodyProps<T>) {
  const getCellAlignmentClass = (align?: Column<T>["cellAlign"]) => {
    if (align === "left") return "text-left";
    if (align === "right") return "text-right";
    return "text-center";
  };

  return (
    <tbody className="divide-y divide-gray-100/50">
      {isLoading ? (
        Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
          <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
            {columns.map((col, colIndex) => (
              <td
                key={`${String(col.key)}-${colIndex}`}
                className={`px-6 py-6 text-[13.5px] font-medium text-gray-700 ${getCellAlignmentClass(col.cellAlign)}`}
              >
                {col.type === "image-card" ? (
                  <div className={`flex items-center gap-3 ${col.cellAlign === "left" ? "justify-start" : col.cellAlign === "right" ? "justify-end" : "justify-center"}`}>
                    <div className="h-12 w-12 rounded-2xl bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-28 rounded-full bg-gray-200" />
                      <div className="h-3 w-20 rounded-full bg-gray-100" />
                    </div>
                  </div>
                ) : col.type === "action-dropdown" ? (
                  <div className={`${col.cellAlign === "left" ? "" : col.cellAlign === "right" ? "ml-auto" : "mx-auto"} h-8 w-8 rounded-lg bg-gray-200`} />
                ) : (
                  <div className={`${col.cellAlign === "left" ? "" : col.cellAlign === "right" ? "ml-auto" : "mx-auto"} h-4 w-20 rounded-full bg-gray-200`} />
                )}
              </td>
            ))}
          </tr>
        ))
      ) : data.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length}
            className="px-6 py-12 text-center text-sm text-gray-400"
          >
            No data available matching your criteria
          </td>
        </tr>
      ) : (
        data.map((row, rowIndex) => (
          <tr
            key={resolveRowKey(row, startIndex + rowIndex)}
            className="transition-colors hover:bg-gray-50/50 group"
          >
            {columns.map((col) => (
              <td key={String(col.key)} className={`px-6 py-6 text-[13.5px] font-medium text-gray-700 ${getCellAlignmentClass(col.cellAlign)}`}>
                <CellRenderer 
                  row={row} 
                  column={col} 
                  resolvedValue={resolveValue(row, col)} 
                />
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}
