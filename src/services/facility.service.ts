import { Facility } from "@/types/facility";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Known facility profiles: maps name keywords to realistic default data
const facilityProfiles: Array<{
  keywords: string[];
  category: string;
  location: string;
  capacity: number;
  status: string;
  operatingHours: string;
}> = [
  { keywords: ["fitness", "gym", "workout"], category: "Sports", location: "Ground Floor", capacity: 40, status: "Available", operatingHours: "06:00 - 22:00" },
  { keywords: ["wifi", "internet"], category: "Business", location: "All Floors", capacity: 0, status: "Available", operatingHours: "24/7" },
  { keywords: ["housekeep", "clean", "laundry"], category: "General", location: "All Floors", capacity: 0, status: "Available", operatingHours: "07:00 - 20:00" },
  { keywords: ["parking", "garage", "valet"], category: "General", location: "Basement Level", capacity: 120, status: "Available", operatingHours: "24/7" },
  { keywords: ["pool", "swim", "aqua"], category: "Wellness", location: "Rooftop", capacity: 60, status: "Available", operatingHours: "07:00 - 21:00" },
  { keywords: ["restaurant", "dining", "dine"], category: "Dining", location: "1st Floor", capacity: 80, status: "Available", operatingHours: "07:00 - 23:00" },
  { keywords: ["breakfast", "brunch"], category: "Dining", location: "1st Floor", capacity: 60, status: "Available", operatingHours: "06:30 - 10:30" },
  { keywords: ["spa", "massage", "sauna", "wellness"], category: "Wellness", location: "3rd Floor", capacity: 20, status: "Available", operatingHours: "09:00 - 21:00" },
  { keywords: ["bar", "lounge", "cocktail"], category: "Entertainment", location: "Rooftop", capacity: 45, status: "Available", operatingHours: "17:00 - 01:00" },
  { keywords: ["business", "conference", "meeting"], category: "Business", location: "2nd Floor", capacity: 30, status: "Available", operatingHours: "08:00 - 20:00" },
  { keywords: ["kids", "child", "play", "game"], category: "Entertainment", location: "Ground Floor", capacity: 25, status: "Available", operatingHours: "09:00 - 19:00" },
  { keywords: ["garden", "terrace", "outdoor"], category: "Entertainment", location: "Ground Floor", capacity: 50, status: "Available", operatingHours: "08:00 - 22:00" },
  { keywords: ["room service", "concierge"], category: "General", location: "Lobby", capacity: 0, status: "Available", operatingHours: "24/7" },
];

/**
 * Enrich a facility with sensible defaults based on its name.
 * Only fills in fields that are currently empty/missing.
 */
function enrichFacilityDefaults(facility: any): any {
  const name = (facility.name || "").toLowerCase();

  // Find a matching profile based on name keywords
  const profile = facilityProfiles.find((p) =>
    p.keywords.some((kw) => name.includes(kw))
  );

  // Default fallback if no keyword match
  const fallback = {
    category: "General",
    location: "Main Building",
    capacity: 0,
    status: "Available",
    operatingHours: "09:00 - 22:00",
  };

  const defaults = profile || fallback;

  return {
    ...facility,
    category: facility.category || defaults.category,
    location: facility.location || defaults.location,
    capacity: facility.capacity || defaults.capacity,
    status: facility.status || defaults.status,
    operatingHours: facility.operatingHours || defaults.operatingHours,
  };
}

/**
 * Fetch all facilities from the backend.
 * @returns Promise<Facility[]>
 */
export const fetchFacilities = async (): Promise<Facility[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch facilities: ${response.statusText}`);
    }

    const result = await response.json();
    let data = result.data || result.facilities || result;
    
    // If data is an object with numerical keys (as seen in the provided JSON), convert to array
    if (data && typeof data === "object" && !Array.isArray(data)) {
      data = Object.values(data);
    }
    
    // Normalize data - map field name variations
    const normalizedData = (Array.isArray(data) ? data : []).map((item: any) => ({
      ...item,
      name: item.name ?? "",
      category: item.category ?? item.facilityCategory ?? "",
      status: item.status ?? "",
      location: item.location ?? item.place ?? item.address ?? "",
      capacity: item.capacity !== undefined ? Number(item.capacity) : 0,
      operatingHours: item.operatingHours ?? item.hours ?? item.operating_hours ?? "",
      description: item.description ?? "",
      image: item.image ?? "",
      icon: item.icon ?? item.facilityIcon ?? "",
    }));
    
    // Enrich facilities that are missing details by inferring from their name
    return normalizedData.map((facility: any) => enrichFacilityDefaults(facility));
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
};

/**
 * Create a new facility.
 * @param facility 
 * @returns Promise<Facility[]>
 */
export const createFacility = async (
  facility: Omit<Facility, "_id" | "createdAt" | "updatedAt">
): Promise<Facility> => {
  try {
    // Explicitly exclude internal fields from the payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, __v, ...payload } = facility as any;

    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || response.statusText;
      throw new Error(`Failed to create facility: ${errorMessage}`);
    }

    const result = await response.json();
    const serverData = result.data?.facility || result.facility || result.data || result;

    // Merge server response (which has _id, timestamps) with user's original input
    // (which has category, location, capacity, etc. that the backend may not persist)
    return {
      ...payload,
      ...serverData,
      // Preserve user input for fields the backend doesn't save
      category: serverData.category || (facility as any).category || "",
      location: serverData.location || (facility as any).location || "",
      capacity: serverData.capacity ?? (facility as any).capacity ?? 0,
      status: serverData.status || (facility as any).status || "Available",
      operatingHours: serverData.operatingHours || (facility as any).operatingHours || "",
      description: serverData.description || (facility as any).description || "",
      icon: serverData.icon || (facility as any).icon || "",
    } as Facility;
  } catch (error) {
    console.error("Error creating facility:", error);
    throw error;
  }
};

/**
 * Update an existing facility.
 * @param id 
 * @param facility 
 * @returns Promise<Facility>
 */
export const updateFacility = async (
  id: string,
  facility: Partial<Facility>
): Promise<Facility> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, createdAt, updatedAt, __v, ...payload } = facility as any;

  const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || errorData?.error || response.statusText;
    throw new Error(`Failed to update facility: ${errorMessage}`);
  }

  const result = await response.json();
  const rawData = result.data?.facility || result.facility || result.data || result;
  
  // Merge server response with user's original input to preserve fields backend doesn't save
  const data = {
    ...facility,
    ...rawData,
    // Preserve user input for fields the backend may not persist
    category: rawData.category || facility.category || "",
    location: rawData.location || facility.location || "",
    capacity: rawData.capacity ?? facility.capacity ?? 0,
    status: rawData.status || facility.status || "Available",
    operatingHours: rawData.operatingHours || facility.operatingHours || "",
    description: rawData.description || facility.description || "",
    icon: rawData.icon || facility.icon || "",
  };
  
  return data;
};

/**
 * Delete a facility.
 * @param id 
 */
export const deleteFacility = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete facility: ${response.statusText}`);
  }
};

export const facilityService = {
  fetchFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
};

