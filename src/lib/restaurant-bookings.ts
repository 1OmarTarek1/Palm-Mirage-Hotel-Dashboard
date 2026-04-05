import { apiRequest, getErrorMessage } from "@/lib/api-client";

import type {
  RestaurantBooking,
  RestaurantBookingDraft,
} from "@/components/RestaurantBookings/data";

interface ApiRestaurantBooking {
  _id?: string;
  id?: string;
  user?: {
    userName?: string;
    email?: string;
    phoneNumber?: string;
  };
  tableNumber?: number | null;
  guests?: number;
  startTime?: string;
  endTime?: string;
  status?: RestaurantBooking["status"];
  paymentStatus?: RestaurantBooking["paymentStatus"];
  createdAt?: string;
}

function toDateKey(value?: string) {
  return value?.slice(0, 10) ?? "";
}

function toTimeLabel(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapApiRestaurantBooking(booking: ApiRestaurantBooking): RestaurantBooking {
  return {
    id: booking._id ?? booking.id ?? "",
    userName: booking.user?.userName ?? "Guest",
    userEmail: booking.user?.email ?? "",
    userPhone: booking.user?.phoneNumber ?? "",
    tableNumber: typeof booking.tableNumber === "number" ? booking.tableNumber : null,
    guests: Number(booking.guests ?? 0),
    bookingDate: toDateKey(booking.startTime),
    startTime: toTimeLabel(booking.startTime),
    endTime: toTimeLabel(booking.endTime),
    status: booking.status ?? "pending",
    paymentStatus: booking.paymentStatus ?? "unpaid",
    createdAt: toDateKey(booking.createdAt),
  };
}

export async function fetchRestaurantBookings() {
  try {
    const data = await apiRequest<{ data?: { bookings?: ApiRestaurantBooking[] } }>(
      "/api/restaurant-bookings"
    );
    const bookings = data?.data?.bookings ?? [];

    return Array.isArray(bookings) ? bookings.map(mapApiRestaurantBooking) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateRestaurantBooking(booking: RestaurantBookingDraft) {
  try {
    const data = await apiRequest<{ data?: { booking?: ApiRestaurantBooking } }>(
      `/api/restaurant-bookings/${booking.id}/status`,
      {
        method: "PATCH",
        body: {
          status: booking.status,
        },
      }
    );

    const updatedBooking = data?.data?.booking;
    if (!updatedBooking) {
      throw new Error("Booking data is missing from the server response.");
    }

    return mapApiRestaurantBooking(updatedBooking);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
