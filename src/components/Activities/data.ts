export type ActivityIcon =
  | "Ship"
  | "Landmark"
  | "Mountain"
  | "Palette"
  | "CloudSun"
  | "ChefHat";

export type ActivityCategory =
  | "nile"
  | "heritage"
  | "desert"
  | "cultural"
  | "balloon"
  | "culinary";

export type ActivityPricingType = "per_person" | "per_group";

export interface ActivityStat {
  value: string;
  label: string;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  label: string;
  image: string;
  imageFile?: File | null;
  icon: ActivityIcon;
  highlights: string[];
  stats: ActivityStat[];
  description: string;
  location: string;
  basePrice: number;
  pricingType: ActivityPricingType;
  durationMinutes: number;
  defaultCapacity: number;
  isActive: boolean;
  createdAt: string;
}

export function createEmptyActivityDraft(): Activity {
  return {
    id: "",
    title: "",
    category: "nile",
    label: "",
    image: "",
    imageFile: null,
    icon: "Ship",
    highlights: [],
    stats: [],
    description: "",
    location: "",
    basePrice: 0,
    pricingType: "per_person",
    durationMinutes: 60,
    defaultCapacity: 10,
    isActive: true,
    createdAt: "",
  };
}

export const activityCategoryOptions: ActivityCategory[] = [
  "nile",
  "heritage",
  "desert",
  "cultural",
  "balloon",
  "culinary",
];

export const activityIconOptions: ActivityIcon[] = [
  "Ship",
  "Landmark",
  "Mountain",
  "Palette",
  "CloudSun",
  "ChefHat",
];

export const activityPricingTypeOptions: ActivityPricingType[] = [
  "per_person",
  "per_group",
];
