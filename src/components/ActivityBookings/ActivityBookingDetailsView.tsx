"use client";

import { toast } from "react-toastify";
import type { ActivityBooking } from "./data";

interface ActivityBookingDetailsViewProps {
  booking: ActivityBooking;
}

export default function ActivityBookingDetailsView({ booking }: ActivityBookingDetailsViewProps) {
  const handleCopyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(booking.id);
      toast.success("Booking ID copied.");
    } catch {
      toast.error("Failed to copy Booking ID.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-[28px] border border-border bg-muted/35 p-5">
        <div>
          <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
            {booking.activityLabel}
          </p>
          <h3 className="font-header mt-2 text-2xl font-bold text-foreground">
            {booking.activityTitle}
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Guest</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.userName}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.userEmail}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.contactPhone}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Session</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.bookingDate} | {booking.startTime} - {booking.endTime}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Guests</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.guests}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">${booking.totalPrice}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.status}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Payment</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.paymentStatus}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created At</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.createdAt}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3 md:col-span-2 xl:col-span-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Booking ID</p>
            <button
              type="button"
              onClick={handleCopyBookingId}
              title={booking.id}
              className="font-main mt-1 block w-full cursor-pointer truncate text-left text-sm font-semibold text-foreground transition hover:text-primary"
            >
              {booking.id}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
          <p className="font-main mt-2 text-sm leading-7 text-muted-foreground">
            {booking.notes || "No notes were added for this booking."}
          </p>
        </div>

        {booking.cancellationReason ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-4">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Cancellation Reason</p>
            <p className="font-main mt-2 text-sm leading-7 text-muted-foreground">
              {booking.cancellationReason}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
