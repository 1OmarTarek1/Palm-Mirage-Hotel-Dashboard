import type { Facility } from "@/types/facility";
import { apiRequest, getErrorMessage } from "@/lib/api-client";

interface ApiFacility {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  description?: string;
  location?: string;
  capacity?: number;
  status?: Facility["status"];
  image?: string;
  icon?: string;
  operatingHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiFacility(facility: ApiFacility): Facility {
  return {
    _id: facility._id ?? facility.id ?? "",
    name: facility.name ?? "",
    category: facility.category ?? "General",
    description: facility.description ?? "",
    location: facility.location ?? "",
    capacity: Number(facility.capacity ?? 0),
    status: facility.status ?? "Available",
    image: facility.image ?? "",
    icon: facility.icon ?? "",
    operatingHours: facility.operatingHours ?? "",
    createdAt: facility.createdAt?.slice(0, 10) ?? "",
    updatedAt: facility.updatedAt?.slice(0, 10) ?? "",
  };
}

function buildFacilityPayload(facility: Facility) {
  return {
    name: facility.name,
    category: facility.category,
    description: facility.description,
    location: facility.location,
    capacity: facility.capacity ?? 0,
    status: facility.status,
    image: facility.image ?? "",
    icon: facility.icon ?? "",
    operatingHours: facility.operatingHours ?? "",
  };
}

export async function fetchFacilities() {
  try {
    const data = await apiRequest<{ data?: { facilities?: ApiFacility[] } }>("/api/facilities", {
      params: { page: 1, limit: 1000 },
    });
    const facilities = data?.data?.facilities ?? [];
    return Array.isArray(facilities) ? facilities.map(mapApiFacility) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type FacilitiesListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  sort?: "name_asc" | "name_desc" | "newest" | "oldest";
};

export async function fetchFacilitiesPage(params: FacilitiesListQuery = {}) {
  try {
    const data = await apiRequest<{
      data?: {
        facilities?: ApiFacility[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/facilities", { params });
    const facilities = data?.data?.facilities ?? [];
    const pg = data?.data?.pagination ?? {};
    return {
      items: Array.isArray(facilities) ? facilities.map(mapApiFacility) : [],
      pagination: {
        page: Number(pg.page ?? params.page ?? 1),
        limit: Number(pg.limit ?? params.limit ?? 10),
        total: Number(pg.total ?? 0),
        totalPages: Number(pg.totalPages ?? 1),
      },
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createFacility(facility: Facility) {
  try {
    const data = await apiRequest<{ data?: { facility?: ApiFacility } }>("/api/facilities", {
      method: "POST",
      body: buildFacilityPayload(facility),
    });

    const createdFacility = data?.data?.facility;
    if (!createdFacility) {
      throw new Error("Facility data is missing from the server response.");
    }

    return mapApiFacility(createdFacility);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateFacility(id: string, facility: Facility) {
  try {
    const data = await apiRequest<{ data?: { facility?: ApiFacility } }>(`/api/facilities/${id}`, {
      method: "PATCH",
      body: buildFacilityPayload(facility),
    });

    const updatedFacility = data?.data?.facility;
    if (!updatedFacility) {
      throw new Error("Facility data is missing from the server response.");
    }

    return mapApiFacility(updatedFacility);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteFacility(id: string) {
  try {
    await apiRequest(`/api/facilities/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
