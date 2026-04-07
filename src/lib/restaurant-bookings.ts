import { apiRequest, getErrorMessage } from "@/lib/api-client";

import type {
  RestaurantBooking,
  RestaurantBookingDraft,
} from "@/components/RestaurantBookings/data";

interface ApiLineItem {
  menuItemId?: string;
  nameSnapshot?: string;
  qty?: number;
  unitPrice?: number;
  name?: string;
  image?: string;
}

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
  bookingMode?: string;
  paymentMethod?: string;
  lineItemsTotal?: number;
  roomNumber?: number | null;
  createdAt?: string;
  lineItems?: ApiLineItem[];
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
  const rawLines = Array.isArray(booking.lineItems) ? booking.lineItems : [];
  const lineItems: RestaurantBooking["lineItems"] = rawLines.map((li) => ({
    menuItemId: String(li.menuItemId ?? ""),
    nameSnapshot: String(li.nameSnapshot ?? "Item"),
    qty: Math.max(0, Number(li.qty ?? 0)),
    unitPrice: Number(li.unitPrice ?? 0),
    name: typeof li.name === "string" ? li.name : undefined,
    image: typeof li.image === "string" ? li.image : undefined,
  }));
  const dishQtyTotal = lineItems.reduce((sum, li) => sum + li.qty, 0);

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
    bookingMode: booking.bookingMode,
    paymentMethod: booking.paymentMethod,
    lineItemsTotal: booking.lineItemsTotal,
    roomNumber: booking.roomNumber ?? null,
    createdAt: toDateKey(booking.createdAt),
    lineItems,
    dishQtyTotal,
  };
}

export async function fetchRestaurantBookings() {
  try {
    const data = await apiRequest<{ data?: { bookings?: ApiRestaurantBooking[] } }>(
      "/api/restaurant-bookings",
      { params: { page: 1, limit: 1000 } }
    );
    const bookings = data?.data?.bookings ?? [];

    return Array.isArray(bookings) ? bookings.map(mapApiRestaurantBooking) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type RestaurantBookingsListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  sort?: "newest" | "oldest" | "start_asc" | "start_desc";
};

export async function fetchRestaurantBookingsPage(params: RestaurantBookingsListQuery = {}) {
  try {
    const data = await apiRequest<{
      data?: {
        bookings?: ApiRestaurantBooking[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/restaurant-bookings", { params });
    const rows = data?.data?.bookings ?? [];
    const pg = data?.data?.pagination ?? {};
    return {
      items: Array.isArray(rows) ? rows.map(mapApiRestaurantBooking) : [],
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

export async function updateRestaurantBooking(booking: RestaurantBookingDraft) {
  try {
    const data = await apiRequest<{ data?: { booking?: ApiRestaurantBooking } }>(
      `/api/restaurant-bookings/${booking.id}/status`,
      {
        method: "PATCH",
        body: {
          status: booking.status,
          ...(booking.paymentStatus ? { paymentStatus: booking.paymentStatus } : {}),
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
