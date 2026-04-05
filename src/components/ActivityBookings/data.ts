export type ActivityBookingStatus =
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rejected";

export type ActivityBookingPaymentStatus = "unpaid" | "paid" | "refunded";

export interface ActivityBooking {
  id: string;
  activityTitle: string;
  activityLabel: string;
  activityImage: string;
  userName: string;
  userEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  guests: number;
  unitPrice: number;
  totalPrice: number;
  pricingType: "per_person" | "per_group";
  status: ActivityBookingStatus;
  paymentStatus: ActivityBookingPaymentStatus;
  contactPhone: string;
  notes: string;
  cancellationReason: string;
  createdAt: string;
}

export interface ActivityBookingDraft {
  id: string;
  status: ActivityBookingStatus;
  paymentStatus: ActivityBookingPaymentStatus;
  cancellationReason: string;
}

export const activityBookingStatusOptions: ActivityBookingStatus[] = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
];

export const activityBookingPaymentStatusOptions: ActivityBookingPaymentStatus[] = [
  "unpaid",
  "paid",
  "refunded",
];
