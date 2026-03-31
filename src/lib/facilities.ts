import { apiRequest, getErrorMessage } from "@/lib/api-client";

export interface Facility {
  _id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchFacilities() {
  try {
    const data = await apiRequest<{ data?: Facility[] }>("/api/facilities");
    // Depending on backend, results might be in data.data or data itself
    const facilities = data?.data || (data as any) || [];
    return Array.isArray(facilities) ? facilities : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
