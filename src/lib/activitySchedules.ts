import type { Activity } from "@/components/Activities/data";
import type {
  ActivitySchedule,
  ActivityScheduleDraft,
  ActivityScheduleStatus,
} from "@/components/ActivitySchedules/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";
import { fetchAllPaginatedItems } from "@/lib/fetchAllPaginatedItems";

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
    const schedules = await fetchAllPaginatedItems<
      {
        data?: {
          schedules?: ApiActivitySchedule[];
          pagination?: { page?: number; limit?: number; totalPages?: number };
        };
      },
      ApiActivitySchedule
    >({
      pageSize: 100,
      requestPage: ({ page, limit }) =>
        apiRequest("/api/activity-schedules", {
          params: {
            page,
            limit,
            sort: "date_asc",
          },
        }),
      extractItems: (response) => response?.data?.schedules ?? [],
      extractPagination: (response) => response?.data,
    });
    return schedules.map(mapApiSchedule);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type ActivitySchedulesListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: "newest" | "oldest" | "date_asc" | "date_desc";
};

export async function fetchActivitySchedulesPage(params: ActivitySchedulesListQuery = {}) {
  try {
    const data = await apiRequest<{
      data?: {
        schedules?: ApiActivitySchedule[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/activity-schedules", { params });

    const rows = data?.data?.schedules ?? [];
    const pg = data?.data?.pagination ?? {};
    return {
      items: Array.isArray(rows) ? rows.map(mapApiSchedule) : [],
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

export async function createActivitySchedule(schedule: ActivityScheduleDraft) {
  try {
    const data = await apiRequest<{ data?: { schedule?: ApiActivitySchedule } }>(
      `/api/activity/${schedule.activityId}/schedules`,
      {
        method: "POST",
        body: buildPayload(schedule),
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
  try {
    const data = await apiRequest<{ data?: { schedule?: ApiActivitySchedule } }>(
      `/api/activity-schedules/${schedule.id}`,
      {
        method: "PATCH",
        body: buildPayload(schedule),
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
  try {
    await apiRequest(`/api/activity-schedules/${scheduleId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
