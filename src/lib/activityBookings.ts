import type { ActivityBooking, ActivityBookingDraft } from "@/components/ActivityBookings/data";
import { apiClient, getAuthHeaders, getErrorMessage, getAccessToken } from "@/lib/api-client";
 
interface ApiBooking {
  _id?: string;
  id?: string;
  activity?: {
    title?: string;
    label?: string;
    image?: string | { secure_url?: string };
  };
  user?: {
    userName?: string;
    email?: string;
  };
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  guests?: number;
  unitPrice?: number;
  totalPrice?: number;
  pricingType?: ActivityBooking["pricingType"];
  status?: ActivityBooking["status"];
  paymentStatus?: ActivityBooking["paymentStatus"];
  contactPhone?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt?: string;
}

function resolveImage(image?: string | { secure_url?: string }) {
  if (!image) return "";
  return typeof image === "string" ? image : image.secure_url ?? "";
}

function mapApiBooking(booking: ApiBooking): ActivityBooking {
  return {
    id: booking._id ?? booking.id ?? "",
    activityTitle: booking.activity?.title ?? "",
    activityLabel: booking.activity?.label ?? "",
    activityImage: resolveImage(booking.activity?.image),
    userName: booking.user?.userName ?? "",
    userEmail: booking.user?.email ?? "",
    bookingDate: booking.bookingDate?.slice(0, 10) ?? "",
    startTime: booking.startTime,
    endTime: booking.endTime,
    guests: Number(booking.guests ?? 0),
    unitPrice: Number(booking.unitPrice ?? 0),
    totalPrice: Number(booking.totalPrice ?? 0),
    pricingType: booking.pricingType ?? "per_person",
    status: booking.status ?? "pending",
    paymentStatus: booking.paymentStatus ?? "unpaid",
    contactPhone: booking.contactPhone ?? "",
    notes: booking.notes ?? "",
    cancellationReason: booking.cancellationReason ?? "",
    createdAt: booking.createdAt?.slice(0, 10) ?? "",
  };
}

export async function fetchActivityBookings() {
  try {
    const accessToken = await getAccessToken();
    const { data } = await apiClient.get("/activity-bookings", {
      headers: accessToken ? await getAuthHeaders() : undefined,
      params: {
        limit: 100,
      },
    });

    const bookings = data?.data?.bookings;

    return Array.isArray(bookings) ? bookings.map(mapApiBooking) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateActivityBooking(booking: ActivityBookingDraft) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await apiClient.patch(
      `/activity-bookings/${booking.id}/status`,
      {
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        cancellationReason: booking.cancellationReason,
      },
      {
        headers: await getAuthHeaders(),
      }
    );

    const updatedBooking = data?.data?.booking;
    if (!updatedBooking) {
      throw new Error("Booking data is missing from the server response.");
    }

    return mapApiBooking(updatedBooking);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
