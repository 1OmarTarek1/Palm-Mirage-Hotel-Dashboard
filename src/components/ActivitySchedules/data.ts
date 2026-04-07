import type { Activity, ActivityPricingType } from "@/components/Activities/data";

export type ActivityScheduleStatus = "scheduled" | "full" | "cancelled" | "completed";

export interface ActivitySchedule {
  id: string;
  activityId: string;
  activityTitle: string;
  activityLabel: string;
  activityCategory: Activity["category"];
  activityImage: string;
  activityLocation: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSeats: number;
  priceOverride: number | null;
  resolvedPrice: number;
  pricingType: ActivityPricingType;
  status: ActivityScheduleStatus;
  notes: string;
  createdAt: string;
}

export interface ActivityOption {
  id: string;
  title: string;
  label: string;
  category: Activity["category"];
  basePrice: number;
  pricingType: ActivityPricingType;
  defaultCapacity: number;
  location: string;
}

export interface ActivityScheduleDraft {
  id: string;
  activityId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSeats: number;
  priceOverride: number | null;
  status: ActivityScheduleStatus;
  notes: string;
}

export function createEmptyActivityScheduleDraft(): ActivityScheduleDraft {
  return {
    id: "",
    activityId: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    capacity: 10,
    availableSeats: 10,
    priceOverride: null,
    status: "scheduled",
    notes: "",
  };
}

export const activityScheduleStatusOptions: ActivityScheduleStatus[] = [
  "scheduled",
  "full",
  "cancelled",
  "completed",
];
