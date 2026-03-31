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
  "Waves", // Pool/Spa
  "Utensils", // Dining
  "Dumbbell", // Gym
  "Wifi", // Business/General
  "Music", // Entertainment
  "Coffee", // Cafe
  "ParkingCircle", // Parking
  "Briefcase", // Business Center
];

export function createEmptyFacilityDraft(): Facility {
  return {
    id: "",
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
