import type { Activity } from "@/components/Activities/data";
import type {
  ActivitySchedule,
  ActivityScheduleDraft,
  ActivityScheduleStatus,
} from "@/components/ActivitySchedules/data";
import { apiClient, getAccessToken, getAuthHeaders, getErrorMessage } from "@/lib/api-client";

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
    const { data } = await apiClient.get("/activity-schedules", {
      params: {
        limit: 100,
        sort: "date_asc",
      },
    });

    const schedules = data?.data?.schedules;

    return Array.isArray(schedules) ? schedules.map(mapApiSchedule) : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createActivitySchedule(schedule: ActivityScheduleDraft) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await apiClient.post(
      `/activity/${schedule.activityId}/schedules`,
      buildPayload(schedule),
      {
        headers: await getAuthHeaders(),
      }
    );

    const createdSchedule = data?.data?.schedule;
    if (!createdSchedule) {
      throw new Error("Schedule data is missing from the server response.");
    }

    return mapApiSchedule(createdSchedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateActivitySchedule(schedule: ActivityScheduleDraft) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await apiClient.patch(
      `/activity-schedules/${schedule.id}`,
      buildPayload(schedule),
      {
        headers: await getAuthHeaders(),
      }
    );

    const updatedSchedule = data?.data?.schedule;
    if (!updatedSchedule) {
      throw new Error("Schedule data is missing from the server response.");
    }

    return mapApiSchedule(updatedSchedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteActivitySchedule(scheduleId: string) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await apiClient.delete(`/activity-schedules/${scheduleId}`, {
      headers: await getAuthHeaders(),
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
