import type { RoomAmenity } from "@/types/room-amenity";

export const roomAmenityIconOptions = [
  "Wifi",
  "Wind",
  "Tv",
  "Bath",
  "Refrigerator",
  "Coffee",
  "Lock",
  "Phone",
  "Monitor",
  "Umbrella",
  "Shirt",
  "Droplets",
  "Waves",
  "Utensils",
];

export function createEmptyRoomAmenityDraft(): RoomAmenity {
  return {
    _id: "",
    name: "",
    icon: "Wifi",
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
