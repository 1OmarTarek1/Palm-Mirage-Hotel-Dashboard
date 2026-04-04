import type { ActivityBooking, ActivityBookingDraft } from "@/components/ActivityBookings/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";
 
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
    name?: string;
    fullName?: string;
    email?: string;
  };
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  guests?: number;
  guestCount?: number;
  numberOfGuests?: number;
  participants?: number;
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
  const resolvedGuests =
    booking.guests ?? booking.guestCount ?? booking.numberOfGuests ?? booking.participants ?? 0;
  const resolvedUserName =
    booking.user?.userName ??
    booking.user?.name ??
    booking.user?.fullName ??
    "Test";

  return {
    id: booking._id ?? booking.id ?? "",
    activityTitle: booking.activity?.title ?? "",
    activityLabel: booking.activity?.label ?? "",
    activityImage: resolveImage(booking.activity?.image),
    userName: resolvedUserName,
    userEmail: booking.user?.email ?? "",
    bookingDate: booking.bookingDate?.slice(0, 10) ?? "",
    startTime: booking.startTime ?? "",
    endTime: booking.endTime ?? "",
    guests: Number(resolvedGuests),
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
    const data = await apiRequest<{ data?: { bookings?: ApiBooking[] } }>("/api/activity-bookings", {
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
  try {
    const data = await apiRequest<{ data?: { booking?: ApiBooking } }>(
      `/api/activity-bookings/${booking.id}/status`,
      {
        method: "PATCH",
        body: {
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          cancellationReason: booking.cancellationReason,
        },
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
