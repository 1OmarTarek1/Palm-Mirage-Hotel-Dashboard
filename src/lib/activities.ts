import type {
  Activity,
  ActivityCategory,
  ActivityIcon,
  ActivityPricingType,
  ActivityStat,
} from "@/components/Activities/data";
import { apiRequest, getErrorMessage } from "@/lib/api-client";
import { fetchAllPaginatedItems } from "@/lib/fetchAllPaginatedItems";

interface ApiActivityImage {
  secure_url?: string;
  public_id?: string;
}

interface ApiActivity {
  _id?: string;
  id?: string;
  category: ActivityCategory;
  label: string;
  title: string;
  description: string;
  location?: string;
  basePrice?: number;
  pricingType?: ActivityPricingType;
  durationMinutes?: number;
  defaultCapacity?: number;
  isActive?: boolean;
  image?: string | ApiActivityImage;
  attacthments?: ApiActivityImage[];
  stats?: ActivityStat[];
  highlights?: string[];
  icon?: ActivityIcon;
  createdAt?: string;
}

function mapApiActivity(activity: ApiActivity): Activity {
  const image =
    typeof activity.image === "string"
      ? activity.image
      : activity.image?.secure_url ?? activity.attacthments?.[0]?.secure_url ?? "";

  return {
    id: activity._id ?? activity.id ?? "",
    category: activity.category,
    label: activity.label,
    title: activity.title,
    description: activity.description,
    location: activity.location ?? "",
    basePrice: Number(activity.basePrice ?? 0),
    pricingType: activity.pricingType ?? "per_person",
    durationMinutes: Number(activity.durationMinutes ?? 60),
    defaultCapacity: Number(activity.defaultCapacity ?? 1),
    isActive: Boolean(activity.isActive ?? true),
    image,
    stats: activity.stats ?? [],
    highlights: activity.highlights ?? [],
    icon: activity.icon ?? "Ship",
    createdAt: activity.createdAt?.slice(0, 10) ?? "",
  };
}

function buildActivityFormData(activity: Activity) {
  const formData = new FormData();
  formData.append("category", activity.category);
  formData.append("label", activity.label);
  formData.append("title", activity.title);
  formData.append("description", activity.description);
  formData.append("location", activity.location);
  formData.append("basePrice", String(activity.basePrice));
  formData.append("pricingType", activity.pricingType);
  formData.append("durationMinutes", String(activity.durationMinutes));
  formData.append("defaultCapacity", String(activity.defaultCapacity));
  formData.append("isActive", String(activity.isActive));
  formData.append("highlights", JSON.stringify(activity.highlights));
  formData.append("stats", JSON.stringify(activity.stats));
  formData.append("icon", activity.icon);

  if (activity.imageFile) {
    formData.append("image", activity.imageFile);
  }

  return formData;
}

export async function fetchActivities() {
  try {
    const activities = await fetchAllPaginatedItems<
      { data?: { activities?: ApiActivity[]; pagination?: { page?: number; limit?: number; totalPages?: number } } },
      ApiActivity
    >({
      pageSize: 100,
      requestPage: ({ page, limit }) =>
        apiRequest("/api/activity", {
          params: { page, limit },
        }),
      extractItems: (response) => response?.data?.activities ?? [],
      extractPagination: (response) => response?.data,
    });

    return activities.map(mapApiActivity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export type ActivitiesListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
};

export async function fetchActivitiesPage(params: ActivitiesListQuery = {}) {
  try {
    const data = await apiRequest<{
      data?: {
        activities?: ApiActivity[];
        pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
      };
    }>("/api/activity", { params });

    const rows = data?.data?.activities ?? [];
    const pg = data?.data?.pagination ?? {};
    return {
      items: Array.isArray(rows) ? rows.map(mapApiActivity) : [],
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

export async function updateActivity(activity: Activity) {
  try {
    const data = await apiRequest<{ data?: { activity?: ApiActivity } }>(`/api/activity/${activity.id}`, {
      method: "PATCH",
      body: buildActivityFormData(activity),
    });

    const updatedActivity = data?.data?.activity;
    if (!updatedActivity) {
      throw new Error("Activity data is missing from the server response.");
    }

    return mapApiActivity(updatedActivity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createActivity(activity: Activity) {
  try {
    await apiRequest("/api/activity", {
      method: "POST",
      body: buildActivityFormData(activity),
    });

    return fetchActivities();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteActivity(activityId: string) {
  try {
    await apiRequest(`/api/activity/${activityId}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
