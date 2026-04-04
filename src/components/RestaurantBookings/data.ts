export type RestaurantBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface RestaurantBooking {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  tableNumber: number | null;
  guests: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: RestaurantBookingStatus;
  createdAt: string;
}

export interface RestaurantBookingDraft {
  id: string;
  status: RestaurantBookingStatus;
}

export const restaurantBookingStatusOptions: RestaurantBookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];
