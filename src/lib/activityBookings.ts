import axios from "axios";
import type { ActivityBooking, ActivityBookingDraft } from "@/components/ActivityBookings/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

function getAccessTokenFromCookies() {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("accessToken="));

  return tokenCookie ? decodeURIComponent(tokenCookie.split("=")[1]) : null;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Request failed";
}

function resolveImage(image?: string | { secure_url?: string }) {
  if (!image) return "";
  return typeof image === "string" ? image : image.secure_url ?? "";
}

function mapApiBooking(booking: any): ActivityBooking {
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
    const accessToken = getAccessTokenFromCookies();
    const { data } = await axios.get(`${API_BASE_URL}/activity-bookings`, {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
      params: {
        limit: 100,
      },
    });

    return (data?.data?.bookings ?? []).map(mapApiBooking);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateActivityBooking(booking: ActivityBookingDraft) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/activity-bookings/${booking.id}/status`,
      {
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        cancellationReason: booking.cancellationReason,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return mapApiBooking(data?.data?.booking);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
