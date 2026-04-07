import type {
  RestaurantTable,
  RestaurantTableDraft,
} from "@/components/Restaurant/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";

interface ApiRestaurantTable {
  _id?: string;
  id?: string;
  number: number;
  chairs: number;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiRestaurantTable(table: ApiRestaurantTable): RestaurantTable {
  return {
    id: table._id ?? table.id ?? String(table.number),
    number: Number(table.number ?? 0),
    chairs: Number(table.chairs ?? 0),
    createdAt: table.createdAt?.slice(0, 10) ?? "",
    updatedAt: table.updatedAt?.slice(0, 10) ?? "",
  };
}

function buildPayload(draft: RestaurantTableDraft) {
  return {
    number: draft.number,
    chairs: draft.chairs,
  };
}

export async function fetchRestaurantTables() {
  try {
    const data = await apiRequest<{ data?: { tables?: ApiRestaurantTable[] } }>(
      "/api/restaurant/tables"
    );
    const tables = data?.data?.tables ?? [];

    return Array.isArray(tables) ? tables.map(mapApiRestaurantTable) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createRestaurantTable(draft: RestaurantTableDraft) {
  try {
    const data = await apiRequest<{ data?: { table?: ApiRestaurantTable } }>(
      "/api/restaurant/tables",
      {
        method: "POST",
        body: buildPayload(draft),
      }
    );

    const table = data?.data?.table;
    if (!table) {
      throw new Error("Table data is missing from the server response.");
    }

    return mapApiRestaurantTable(table);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRestaurantTable(
  tableNumber: number,
  draft: RestaurantTableDraft
) {
  try {
    const data = await apiRequest<{ data?: { table?: ApiRestaurantTable } }>(
      `/api/restaurant/tables/${tableNumber}`,
      {
        method: "PATCH",
        body: buildPayload(draft),
      }
    );

    const table = data?.data?.table;
    if (!table) {
      throw new Error("Updated table data is missing from the server response.");
    }

    return mapApiRestaurantTable(table);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteRestaurantTable(tableNumber: number) {
  try {
    await apiRequest(`/api/restaurant/tables/${tableNumber}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
