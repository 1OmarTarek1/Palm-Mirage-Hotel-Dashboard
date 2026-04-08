import { apiRequest, getErrorMessage } from "@/lib/api-client";
import type { Room, RoomAmenityPreview, RoomDraft, RoomType } from "@/components/Rooms/data";

interface ApiRoomAmenity {
  _id?: string;
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
}

interface ApiRoom {
  _id: string;
  roomName: string;
  roomNumber: number;
  roomType: string;
  price: number;
  finalPrice?: number;
  capacity: number;
  discount: number;
  description: string;
  facilities: ApiRoomAmenity[];
  amenities?: ApiRoomAmenity[];
  roomImages: { secure_url: string; public_id: string }[];
  hasOffer: boolean;
  isAvailable: boolean;
  floor: number;
  rating: number;
  reviewsCount: number;
  viewsCount: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  createdAt: string;
}

function mapRoomType(roomType: string): RoomType {
  const validRoomTypes: RoomType[] = ["single", "double", "twin", "deluxe", "family"];
  return validRoomTypes.includes(roomType as RoomType) ? (roomType as RoomType) : "single";
}

function isDefinedString(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function mapApiRoom(apiRoom: ApiRoom): Room {
  const populatedAmenities = (apiRoom.amenities ?? apiRoom.facilities ?? [])
    .map((amenity: ApiRoomAmenity): RoomAmenityPreview | null => {
      if (typeof amenity !== "object" || amenity === null) return null;
      const id = amenity._id ?? amenity.id;
      if (!id) return null;
      return {
        _id: id,
        name: amenity.name ?? "Amenity",
        icon: amenity.icon ?? "",
      };
    })
    .filter(Boolean) as RoomAmenityPreview[];

  return {
    id: apiRoom._id,
    roomName: apiRoom.roomName,
    roomNumber: apiRoom.roomNumber,
    roomType: mapRoomType(apiRoom.roomType),
    image: apiRoom.roomImages?.[0]?.secure_url || "",
    price: apiRoom.price,
    finalPrice: apiRoom.finalPrice,
    capacity: apiRoom.capacity,
    discount: apiRoom.discount,
    description: apiRoom.description,
    amenities:
      (apiRoom.amenities ?? apiRoom.facilities)
        ?.map((f: ApiRoomAmenity) => {
          if (typeof f === "object" && f !== null) return f._id || f.id;
          return undefined;
        })
        .filter(isDefinedString) || [],
    amenityDetails: populatedAmenities,
    roomImages: apiRoom.roomImages || [],
    hasOffer: apiRoom.hasOffer,
    isAvailable: apiRoom.isAvailable,
    floor: apiRoom.floor,
    rating: apiRoom.rating,
    reviewsCount: apiRoom.reviewsCount,
    viewsCount: apiRoom.viewsCount,
    checkInTime: apiRoom.checkInTime,
    checkOutTime: apiRoom.checkOutTime,
    cancellationPolicy: apiRoom.cancellationPolicy,
    createdAt: apiRoom.createdAt,
  };
}

function buildRoomFormData(room: RoomDraft) {
  const formData = new FormData();
  formData.append("roomName", room.roomName);
  formData.append("roomNumber", String(room.roomNumber));
  formData.append("roomType", room.roomType);
  formData.append("price", String(room.price));
  formData.append("capacity", String(room.capacity));
  formData.append("discount", String(room.discount));
  formData.append("description", room.description);
  formData.append("hasOffer", String(room.hasOffer));
  formData.append("isAvailable", String(room.isAvailable));
  formData.append("floor", String(room.floor ?? 1));
  formData.append("checkInTime", room.checkInTime);
  formData.append("checkOutTime", room.checkOutTime);
  formData.append("cancellationPolicy", room.cancellationPolicy || "");

  if (room.amenities?.length) {
    room.amenities
      .filter((id) => id && id !== "undefined" && typeof id === "string")
      .forEach((id) => formData.append("amenities", id));
  }

  if (room.deletedImageIds?.length) {
    room.deletedImageIds
      .filter((id) => id && typeof id === "string")
      .forEach((id) => formData.append("deletedImages", id));
  }

  if (room.imageFiles?.length) {
    room.imageFiles.forEach((file) => formData.append("roomImages", file));
  }

  return formData;
}

export async function fetchRooms() {
  try {
    const response = await fetchRoomsPage({ page: 1, limit: 1000 });
    return response.items;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type RoomsListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  roomType?: string;
  isAvailable?: string;
};

export type RoomsListResponse = {
  items: Room[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export async function fetchRoomsPage(params: RoomsListQuery = {}): Promise<RoomsListResponse> {
  const response = await apiRequest<{
    data?: {
      data?: ApiRoom[];
      rooms?: ApiRoom[];
      items?: ApiRoom[];
      pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
      };
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
      hasNextPage?: boolean;
      hasPrevPage?: boolean;
    };
  }>("/api/rooms", { params });

  const payload = response?.data ?? {};
  const rows = payload.items ?? payload.rooms ?? payload.data ?? [];
  const pg = payload.pagination ?? payload;

  return {
    items: Array.isArray(rows) ? rows.map(mapApiRoom) : [],
    pagination: {
      page: Number(pg?.page ?? params.page ?? 1),
      limit: Number(pg?.limit ?? params.limit ?? 10),
      total: Number(pg?.total ?? 0),
      totalPages: Number(pg?.totalPages ?? 1),
      hasNextPage: Boolean(pg?.hasNextPage ?? false),
      hasPrevPage: Boolean(pg?.hasPrevPage ?? false),
    },
  };
}

export async function createRoom(room: RoomDraft) {
  try {
    const formData = buildRoomFormData(room);
    await apiRequest("/api/rooms", {
      method: "POST",
      body: formData,
    });
    return fetchRooms();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRoom(id: string, room: RoomDraft) {
  try {
    const formData = buildRoomFormData(room);
    // Note: Backend might need specific fields for updating images if they are being replaced
    await apiRequest(`/api/rooms/${id}`, {
      method: "PATCH",
      body: formData,
    });
    return fetchRooms();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteRoom(id: string) {
  try {
    await apiRequest(`/api/rooms/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
