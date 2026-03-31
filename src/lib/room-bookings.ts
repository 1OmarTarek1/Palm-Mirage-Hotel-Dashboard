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
  if (!apiBooking) return {} as RoomBooking;
  
  const userObj = apiBooking.user as any;
  const roomObj = apiBooking.room as any;

  return {
    id: apiBooking._id,
    user: typeof userObj === "object" && userObj ? userObj._id : userObj || "",
    userName: userObj?.userName || "Guest",
    room: typeof roomObj === "object" && roomObj ? roomObj._id : roomObj || "",
    roomName: roomObj?.roomName || "Room",
    roomNumber: roomObj?.roomNumber || 0,
    roomType: roomObj?.roomType || "single",
    roomImage: roomObj?.roomImages?.[0]?.secure_url || "",
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
    const response = await apiRequest<{ data: { reservations: ApiBooking[] } }>("/api/reservations");
    const data = response?.data?.reservations || [];
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
