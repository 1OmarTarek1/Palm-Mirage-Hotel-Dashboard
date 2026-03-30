import axios from "axios";
import { getSession } from "next-auth/react";
import type {
  Activity,
  ActivityCategory,
  ActivityIcon,
  ActivityPricingType,
  ActivityStat,
} from "@/components/Activities/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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

async function getAccessToken() {
  const session = await getSession();
  return (session as any)?.token ?? null;
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

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Request failed";
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
    const { data } = await axios.get(`${API_BASE_URL}/activity`);

    return (data?.data?.activities ?? []).map(mapApiActivity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateActivity(activity: Activity) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    const { data } = await axios.patch(
      `${API_BASE_URL}/activity/${activity.id}`,
      buildActivityFormData(activity),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return mapApiActivity(data?.data?.activity);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createActivity(activity: Activity) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await axios.post(`${API_BASE_URL}/activity`, buildActivityFormData(activity), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return fetchActivities();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteActivity(activityId: string) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  try {
    await axios.delete(`${API_BASE_URL}/activity/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
