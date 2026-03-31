export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked-in"
  | "completed"
  | "cancelled"
  | "no-show";

export const roomBookingStatusOptions: BookingStatus[] = [
  "pending",
  "confirmed",
  "checked-in",
  "completed",
  "cancelled",
  "no-show",
];

export type PaymentStatus = "unpaid" | "paid" | "refunded";
export const roomBookingPaymentStatusOptions: PaymentStatus[] = ["unpaid", "paid", "refunded"];

export type PaymentMethod = "cash" | "card" | "online";

export interface RoomBooking {
  id: string;
  user: string;
  userName: string;
  room: string;
  roomName: string;
  roomNumber: number;
  roomType: string;
  roomImage?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  guests: number;
  totalPrice: number;
  pricePerNight: number;
  specialRequests?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface RoomBookingDraft {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  cancellationReason?: string;
}
