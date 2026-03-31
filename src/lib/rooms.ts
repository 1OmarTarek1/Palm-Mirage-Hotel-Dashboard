import { apiRequest, getErrorMessage } from "@/lib/api-client";
import type { Room, RoomDraft } from "@/components/Rooms/data";

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
  facilities: any[];
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

function mapApiRoom(apiRoom: ApiRoom): Room {
  return {
    id: apiRoom._id,
    roomName: apiRoom.roomName,
    roomNumber: apiRoom.roomNumber,
    roomType: apiRoom.roomType as any,
    image: apiRoom.roomImages?.[0]?.secure_url || "",
    price: apiRoom.price,
    finalPrice: apiRoom.finalPrice,
    capacity: apiRoom.capacity,
    discount: apiRoom.discount,
    description: apiRoom.description,
    facilities: apiRoom.facilities?.map((f: any) => {
      if (typeof f === "object" && f !== null) return f._id || f.id;
      return f;
    }).filter(Boolean) || [],
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

  if (room.facilities?.length) {
    room.facilities
      .filter((id) => id && id !== "undefined" && typeof id === "string")
      .forEach((id) => formData.append("facilities", id));
  }

  if (room.imageFiles?.length) {
    room.imageFiles.forEach((file) => formData.append("roomImages", file));
  }

  return formData;
}

export async function fetchRooms() {
  try {
    const response = await apiRequest<{ data: { data: ApiRoom[] } }>("/api/rooms");
    return response?.data?.data?.map(mapApiRoom) || [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
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
