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
  "Waves",         // Pool/Spa
  "Utensils",      // Dining
  "Dumbbell",      // Gym
  "Wifi",          // Internet
  "Music",         // Entertainment
  "Coffee",        // Cafe
  "ParkingCircle", // Parking
  "Briefcase",     // Business Center
  "Sparkles",      // Spa/Cleaning
  "Bed",           // Rooms
  "Bath",          // Bathroom
  "ChefHat",       // Kitchen
  "Wine",          // Bar
  "TreePine",      // Garden
  "Umbrella",      // Beach
  "Trophy",        // Sports
  "Gamepad2",      // Kids/Games
  "Bike",          // Cycling
  "BookOpen",      // Library
  "Scissors",      // Salon
  "Star",          // Premium
  "Heart",         // Wellness
  "Sun",           // Solarium
  "Flame",         // Fireplace/BBQ
  "Globe",         // Tours
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
