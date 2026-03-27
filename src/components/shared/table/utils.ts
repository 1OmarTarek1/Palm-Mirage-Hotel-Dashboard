import { Column } from "./types";

function getRawValue<T extends object>(row: T, column: Column<T>): unknown {
  let value: unknown = (row as Record<string, unknown>)[column.key as string];

  if (column.accessorKey) {
    const keys = column.accessorKey.split(".");
    let current: unknown = row;
    for (const k of keys) {
      if (current === null || current === undefined || typeof current !== "object") {
        current = undefined;
        break;
      }
      current = (current as Record<string, unknown>)[k];
    }
    value = current;
  }

  return value;
}

export function resolveValue<T extends object>(row: T, column: Column<T>): unknown {
  if (!row) return "";

  const value = getRawValue(row, column);

  if (value === null || value === undefined) return "";

  // Format based on accessorType
  switch (column.accessorType) {
    case "join":
      return Array.isArray(value) ? value.join(", ") : String(value);
    case "count":
      return Array.isArray(value) ? value.length : 0;
    case "date":
      return new Date(String(value)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    case "text":
    default:
      if (typeof value === "object") {
        return JSON.stringify(value);
      }
      return String(value);
  }
}

export function resolveSortValue<T extends object>(row: T, column: Column<T>): unknown {
  const value = getRawValue(row, column);

  if (value === null || value === undefined) return "";

  switch (column.accessorType) {
    case "count":
      return Array.isArray(value) ? value.length : 0;
    case "date": {
      const timestamp = Date.parse(String(value));
      return Number.isNaN(timestamp) ? String(value) : timestamp;
    }
    default:
      return value;
  }
}

export function resolveRowKey<T extends object>(
  row: T,
  fallbackKey: string | number
) {
  const record = row as Record<string, unknown>;
  const preferredKey = record.id ?? record._id ?? record.key;
  return String(preferredKey ?? fallbackKey);
}
