import { Facility, FacilityStatus } from "@/types/facility";

export const facilityCategoryOptions = [
  "Wellness",
  "Dining",
  "Entertainment",
  "Sports",
  "Business",
  "General",
];

export const facilityStatusOptions: FacilityStatus[] = [
  "Available",
  "Maintenance",
  "Busy",
  "Closed",
];

export const facilityIconOptions = [
  "Wifi",
  "Fitness",
  "Housekeeping",
  "Parking",
  "Waves",
  "Dumbbell",
  "Utensils",
  "Coffee",
  "Music",
  "Briefcase",
  "Sparkles",
  "ParkingCircle",
];

export function createEmptyFacilityDraft(): Facility {
  return {
    _id: "",
    name: "",
    category: "General",
    description: "",
    location: "",
    capacity: 0,
    status: "Available",
    image: "",
    icon: "Wifi",
    operatingHours: "09:00 - 22:00",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
