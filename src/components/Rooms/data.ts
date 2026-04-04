export type RoomType = "single" | "double" | "twin" | "deluxe" | "family";

export interface RoomImage {
  secure_url?: string;
  public_id?: string;
}

export interface RoomAmenityPreview {
  _id: string;
  name: string;
  icon?: string;
}

export interface Room {
  id: string;
  roomName: string;
  roomNumber: number;
  roomType: RoomType;
  image?: string;
  price: number;
  finalPrice?: number;
  capacity: number;
  discount: number;
  description: string;
  amenities: string[];
  amenityDetails?: RoomAmenityPreview[];
  roomImages: RoomImage[];
  hasOffer: boolean;
  isAvailable: boolean;
  floor?: number;
  rating: number;
  reviewsCount: number;
  viewsCount: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy?: string;
  createdAt: string;
}

export interface RoomDraft
  extends Omit<
    Room,
    "id" | "createdAt" | "reviewsCount" | "viewsCount" | "rating" | "finalPrice" | "amenityDetails"
  > {
  imageFiles?: File[];
}

export function createEmptyRoomDraft(): RoomDraft {
  return {
    roomName: "",
    roomNumber: 0,
    roomType: "single",
    price: 0,
    capacity: 1,
    discount: 0,
    description: "",
    amenities: [],
    roomImages: [],
    hasOffer: false,
    isAvailable: true,
    floor: 1,
    checkInTime: "14:00",
    checkOutTime: "12:00",
    cancellationPolicy: "",
  };
}
