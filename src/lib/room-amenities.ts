import { apiRequest, getErrorMessage } from "@/lib/api-client";
import type { RoomAmenity } from "@/types/room-amenity";

interface ApiRoomAmenity {
  _id?: string;
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiRoomAmenity(amenity: ApiRoomAmenity): RoomAmenity {
  return {
    _id: amenity._id ?? amenity.id ?? "",
    name: amenity.name ?? "",
    icon: amenity.icon ?? "Wifi",
    description: amenity.description ?? "",
    createdAt: amenity.createdAt?.slice(0, 10) ?? "",
    updatedAt: amenity.updatedAt?.slice(0, 10) ?? "",
  };
}

function buildRoomAmenityPayload(amenity: RoomAmenity) {
  return {
    name: amenity.name,
    icon: amenity.icon ?? "Wifi",
    description: amenity.description ?? "",
  };
}

export async function fetchRoomAmenities() {
  try {
    const data =
      await apiRequest<{ data?: { amenities?: ApiRoomAmenity[] } }>("/api/room-amenities");
    const amenities = data?.data?.amenities ?? [];
    return Array.isArray(amenities) ? amenities.map(mapApiRoomAmenity) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createRoomAmenity(amenity: RoomAmenity) {
  try {
    const data = await apiRequest<{ data?: { amenity?: ApiRoomAmenity } }>("/api/room-amenities", {
      method: "POST",
      body: buildRoomAmenityPayload(amenity),
    });

    const createdAmenity = data?.data?.amenity;
    if (!createdAmenity) {
      throw new Error("Failed to create room amenity.");
    }

    return mapApiRoomAmenity(createdAmenity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRoomAmenity(id: string, amenity: RoomAmenity) {
  try {
    const data = await apiRequest<{ data?: { amenity?: ApiRoomAmenity } }>(
      `/api/room-amenities/${id}`,
      {
        method: "PATCH",
        body: buildRoomAmenityPayload(amenity),
      }
    );

    const updatedAmenity = data?.data?.amenity;
    if (!updatedAmenity) {
      throw new Error("Failed to update room amenity.");
    }

    return mapApiRoomAmenity(updatedAmenity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteRoomAmenity(id: string) {
  try {
    await apiRequest(`/api/room-amenities/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
