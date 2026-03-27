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
  createdAt: string;
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
