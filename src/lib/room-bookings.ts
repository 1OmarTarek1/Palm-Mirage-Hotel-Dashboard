import { apiRequest, getErrorMessage } from "@/lib/api-client";
import type { RoomBooking, RoomBookingDraft } from "@/components/RoomBookings/data";

interface ApiBooking {
  _id: string;
  user?: {
    userName?: string;
    email?: string;
  };
  room?: {
    roomName?: string;
    roomNumber?: number;
    roomType?: string;
    price?: number;
  };
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  guests: number;
  totalPrice: number;
  pricePerNight: number;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
}

function mapApiBooking(apiBooking: ApiBooking): RoomBooking {
  return {
    id: apiBooking._id,
    user: typeof apiBooking.user === "object" ? (apiBooking.user as any)._id : apiBooking.user || "",
    userName: apiBooking.user?.userName || "Guest",
    room: typeof apiBooking.room === "object" ? (apiBooking.room as any)._id : apiBooking.room || "",
    roomName: apiBooking.room?.roomName || "Room",
    roomNumber: apiBooking.room?.roomNumber || 0,
    roomType: apiBooking.room?.roomType || "single",
    roomImage: (apiBooking.room as any)?.roomImages?.[0]?.secure_url || "",
    checkInDate: apiBooking.checkInDate?.slice(0, 10) || "",
    checkOutDate: apiBooking.checkOutDate?.slice(0, 10) || "",
    nights: apiBooking.nights || 0,
    status: apiBooking.status as any,
    paymentStatus: apiBooking.paymentStatus as any,
    paymentMethod: apiBooking.paymentMethod as any,
    guests: apiBooking.guests || 0,
    totalPrice: apiBooking.totalPrice || 0,
    pricePerNight: apiBooking.pricePerNight || 0,
    specialRequests: apiBooking.specialRequests,
    cancellationReason: apiBooking.cancellationReason,
    createdAt: apiBooking.createdAt?.slice(0, 10) || "",
  };
}

export async function fetchRoomBookings() {
  try {
    const response = await apiRequest<{ data: { data: ApiBooking[] } }>("/api/reservations");
    // Depending on backend, results might be in response.data.data
    const data = response?.data?.data || (response?.data as any) || [];
    return Array.isArray(data) ? data.map(mapApiBooking) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRoomBooking(draft: RoomBookingDraft) {
  try {
    const response = await apiRequest<{ data: ApiBooking }>(`/api/reservations/${draft.id}`, {
      method: "PATCH",
      body: {
        status: draft.status,
        paymentStatus: draft.paymentStatus,
        cancellationReason: draft.cancellationReason,
      },
    });
    return mapApiBooking(response?.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
