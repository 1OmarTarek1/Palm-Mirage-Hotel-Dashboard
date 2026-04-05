export type RestaurantBookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type RestaurantBookingPaymentStatus = "unpaid" | "paid" | "refunded";

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
  paymentStatus: RestaurantBookingPaymentStatus;
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
