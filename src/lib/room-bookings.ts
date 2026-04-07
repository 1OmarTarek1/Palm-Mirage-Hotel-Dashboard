import { apiRequest, getErrorMessage } from "@/lib/api-client";
import type { RoomBooking, RoomBookingDraft } from "@/components/RoomBookings/data";

interface ApiBooking {
  _id: string;
  user?: {
    _id?: string;
    userName?: string;
    email?: string;
  };
  room?: {
    _id?: string;
    roomName?: string;
    roomNumber?: number;
    roomType?: string;
    price?: number;
    roomImages?: Array<{
      secure_url?: string;
      public_id?: string;
    }>;
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

function isApiBookingRecord(value: unknown): value is Record<string, ApiBooking> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.keys(value).every((key) => /^\d+$/.test(key));
}

function normalizeBookingCollection(
  payload?: ApiBooking[] | { bookings?: ApiBooking[]; reservations?: ApiBooking[] } | Record<string, ApiBooking>
) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload.bookings)) {
    return payload.bookings;
  }

  if (Array.isArray(payload.reservations)) {
    return payload.reservations;
  }

  if (isApiBookingRecord(payload)) {
    return Object.values(payload);
  }

  return [];
}

function mapApiBooking(apiBooking: ApiBooking): RoomBooking {
  if (!apiBooking) return {} as RoomBooking;

  const userObj = apiBooking.user;
  const roomObj = apiBooking.room;

  return {
    id: apiBooking._id,
    user: userObj?._id || "",
    userName: userObj?.userName || "Guest",
    room: roomObj?._id || "",
    roomName: roomObj?.roomName || "Room",
    roomNumber: roomObj?.roomNumber || 0,
    roomType: roomObj?.roomType || "single",
    roomImage: roomObj?.roomImages?.[0]?.secure_url || "",
    checkInDate: apiBooking.checkInDate?.slice(0, 10) || "",
    checkOutDate: apiBooking.checkOutDate?.slice(0, 10) || "",
    nights: apiBooking.nights || 0,
    status: apiBooking.status as RoomBooking["status"],
    paymentStatus: apiBooking.paymentStatus as RoomBooking["paymentStatus"],
    paymentMethod: apiBooking.paymentMethod as RoomBooking["paymentMethod"],
    guests: apiBooking.guests || 0,
    totalPrice: apiBooking.totalPrice || 0,
    pricePerNight: apiBooking.pricePerNight || 0,
    specialRequests: apiBooking.specialRequests,
    cancellationReason: apiBooking.cancellationReason,
    createdAt: apiBooking.createdAt?.slice(0, 10) || "",
  };
}

export type RoomBookingDashboardMetrics = {
  today: string;
  weekKeys: string[];
  arrivalsToday: number;
  departuresToday: number;
  pendingRoomBookings: number;
  unpaidRoomBookings: number;
  noShowBookings: number;
  checkedInGuests: number;
  todayRoomRevenue: number;
  bookingStatusCounts: {
    pending: number;
    confirmed: number;
    checkedIn: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
  roomRevenueByDay: number[];
  recentRoomBookings: Array<{
    id: string;
    guestName: string;
    roomNumber: number;
    nights: number;
    status: string;
    totalPrice: number;
  }>;
};

export async function fetchRoomBookingDashboardMetrics(params: { today: string; weekKeys: string[] }) {
  try {
    const response = await apiRequest<{ data?: RoomBookingDashboardMetrics }>("/api/reservations", {
      params: {
        dashboard: "1",
        today: params.today,
        weekKeys: params.weekKeys.join(","),
      },
    });
    return response?.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchRoomBookings(options?: { summary?: boolean }) {
  try {
    const response = await apiRequest<{
      data?: ApiBooking[] | { bookings?: ApiBooking[]; reservations?: ApiBooking[] } | Record<string, ApiBooking>;
    }>("/api/reservations", {
      params: options?.summary ? { summary: "1", page: 1, limit: 1000 } : { page: 1, limit: 1000 },
    });
    const data = normalizeBookingCollection(response?.data);
    return Array.isArray(data) ? data.map(mapApiBooking) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type RoomBookingsListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  sort?: "newest" | "oldest" | "checkIn_asc" | "checkIn_desc";
  summary?: boolean;
};

export async function fetchRoomBookingsPage(params: RoomBookingsListQuery = {}) {
  try {
    const response = await apiRequest<{
      data?: {
        bookings?: ApiBooking[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/reservations", {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search,
        status: params.status,
        paymentStatus: params.paymentStatus,
        sort: params.sort,
        ...(params.summary ? { summary: "1" } : {}),
      },
    });
    const rows = response?.data?.bookings ?? [];
    const pg = response?.data?.pagination ?? {};
    return {
      items: Array.isArray(rows) ? rows.map(mapApiBooking) : [],
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

export async function updateRoomBooking(draft: RoomBookingDraft) {
  try {
    const response = await apiRequest<{ data?: ApiBooking | { booking?: ApiBooking } }>(
      `/api/reservations/${draft.id}`,
      {
      method: "PATCH",
      body: {
        status: draft.status,
        paymentStatus: draft.paymentStatus,
        cancellationReason: draft.cancellationReason,
      },
      }
    );
    const payload =
      response?.data && "booking" in response.data ? response.data.booking : response?.data;
    return mapApiBooking(payload as ApiBooking);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
