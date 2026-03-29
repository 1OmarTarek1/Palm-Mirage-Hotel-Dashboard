import axios from "axios";
import type { Activity } from "@/components/Activities/data";
import type {
  ActivitySchedule,
  ActivityScheduleDraft,
  ActivityScheduleStatus,
} from "@/components/ActivitySchedules/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

interface ApiActivitySummary {
  id?: string;
  _id?: string;
  title: string;
  label: string;
  category: Activity["category"];
  image?: string | { secure_url?: string };
  basePrice?: number;
  pricingType?: Activity["pricingType"];
  location?: string;
}

interface ApiActivitySchedule {
  _id?: string;
  id?: string;
  activity?: ApiActivitySummary | null;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSeats: number;
  priceOverride?: number | null;
  resolvedPrice?: number;
  status: ActivityScheduleStatus;
  notes?: string;
  createdAt?: string;
}

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

function resolveImage(image?: ApiActivitySummary["image"]) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.secure_url ?? "";
}

function mapApiSchedule(schedule: ApiActivitySchedule): ActivitySchedule {
  return {
    id: schedule._id ?? schedule.id ?? "",
    activityId: schedule.activity?._id ?? schedule.activity?.id ?? "",
    activityTitle: schedule.activity?.title ?? "Untitled activity",
    activityLabel: schedule.activity?.label ?? "",
    activityCategory: schedule.activity?.category ?? "nile",
    activityImage: resolveImage(schedule.activity?.image),
    activityLocation: schedule.activity?.location ?? "",
    date: schedule.date?.slice(0, 10) ?? "",
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    capacity: Number(schedule.capacity ?? 0),
    availableSeats: Number(schedule.availableSeats ?? 0),
    priceOverride:
      schedule.priceOverride === null || schedule.priceOverride === undefined
        ? null
        : Number(schedule.priceOverride),
    resolvedPrice: Number(
      schedule.resolvedPrice ?? schedule.priceOverride ?? schedule.activity?.basePrice ?? 0
    ),
    pricingType: schedule.activity?.pricingType ?? "per_person",
    status: schedule.status,
    notes: schedule.notes ?? "",
    createdAt: schedule.createdAt?.slice(0, 10) ?? "",
  };
}

function buildPayload(schedule: ActivityScheduleDraft) {
  return {
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    capacity: schedule.capacity,
    availableSeats: schedule.availableSeats,
    priceOverride: schedule.priceOverride,
    status: schedule.status,
    notes: schedule.notes,
  };
}

export async function fetchActivitySchedules() {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/activity-schedules`, {
      params: {
        limit: 100,
        sort: "date_asc",
      },
    });

    return (data?.data?.schedules ?? []).map(mapApiSchedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createActivitySchedule(schedule: ActivityScheduleDraft) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/activity/${schedule.activityId}/schedules`,
      buildPayload(schedule),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return mapApiSchedule(data?.data?.schedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateActivitySchedule(schedule: ActivityScheduleDraft) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/activity-schedules/${schedule.id}`,
      buildPayload(schedule),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return mapApiSchedule(data?.data?.schedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteActivitySchedule(scheduleId: string) {
  const accessToken = getAccessTokenFromCookies();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/activity-schedules/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
