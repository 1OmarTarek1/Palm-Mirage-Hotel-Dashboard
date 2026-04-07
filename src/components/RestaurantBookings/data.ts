export type RestaurantBookingStatus =
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "cancelled"
  | "completed";

export type RestaurantBookingPaymentStatus = "unpaid" | "paid" | "refunded";

export interface RestaurantBookingLineItem {
  menuItemId: string;
  nameSnapshot: string;
  qty: number;
  unitPrice: number;
  name?: string;
  image?: string;
}

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
  bookingMode?: string;
  paymentMethod?: string;
  lineItemsTotal?: number;
  roomNumber?: number | null;
  createdAt: string;
  lineItems: RestaurantBookingLineItem[];
  /** Total dish quantity (sum of line qty) for table display */
  dishQtyTotal: number;
}

export interface RestaurantBookingDraft {
  id: string;
  status: RestaurantBookingStatus;
  paymentStatus?: RestaurantBookingPaymentStatus;
}

export const restaurantBookingStatusOptions: RestaurantBookingStatus[] = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "completed",
  "cancelled",
];

export const restaurantBookingPaymentStatusOptions: RestaurantBookingPaymentStatus[] = [
  "unpaid",
  "paid",
  "refunded",
];
