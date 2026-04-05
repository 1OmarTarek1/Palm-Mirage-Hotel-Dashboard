"use client";

import { toast } from "react-toastify";

import type { RestaurantBooking } from "./data";

interface RestaurantBookingDetailsViewProps {
  booking: RestaurantBooking;
}

const FALLBACK_DISH_IMG =
  "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop";

function bookingModeLabel(mode?: string) {
  switch (mode) {
    case "table_only":
      return "Table only";
    case "dine_in":
      return "Dine in (cart)";
    case "room_service":
      return "Room service";
    default:
      return mode ?? "—";
  }
}

export default function RestaurantBookingDetailsView({
  booking,
}: RestaurantBookingDetailsViewProps) {
  const handleCopyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(booking.id);
      toast.success("Booking ID copied.");
    } catch {
      toast.error("Failed to copy Booking ID.");
    }
  };

  const hasLines = booking.lineItems.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-[28px] border border-border bg-muted/35 p-5">
        <div>
          <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Restaurant Booking
          </p>
          <h3 className="font-header mt-2 text-2xl font-bold text-foreground">{booking.userName}</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Guest
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.userName}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Email
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.userEmail || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Phone
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.userPhone || "N/A"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Date
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.bookingDate}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Time
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.startTime} - {booking.endTime}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Guests
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.guests}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Table
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.tableNumber ? `Table ${booking.tableNumber}` : "Waitlist / Unassigned"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Booking type
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {bookingModeLabel(booking.bookingMode)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Payment method
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {booking.paymentMethod === "stripe" ? "Card" : booking.paymentMethod === "cash" ? "Cash" : "—"}
            </p>
          </div>
          {booking.roomNumber != null ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Room #
              </p>
              <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.roomNumber}</p>
            </div>
          ) : null}
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Status
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.status}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Payment
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.paymentStatus}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Food subtotal
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {typeof booking.lineItemsTotal === "number"
                ? `$${booking.lineItemsTotal.toFixed(2)}`
                : hasLines
                  ? `$${booking.lineItems.reduce((s, li) => s + li.unitPrice * li.qty, 0).toFixed(2)}`
                  : "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Created At
            </p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{booking.createdAt}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-4 py-3 md:col-span-2 xl:col-span-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Booking ID
            </p>
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
      </div>

      <div className="rounded-[28px] border border-border bg-card p-5">
        <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">Order (from guest cart)</p>
        <p className="font-main mt-1 text-sm text-muted-foreground">
          Items were chosen on the website cart (Restaurant tab). Snapshot names and prices are stored on the booking.
        </p>

        {!hasLines ? (
          <p className="font-main mt-4 text-sm text-muted-foreground">
            No menu lines on this booking (e.g. table-only reservation).
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {booking.lineItems.map((li) => {
              const title = li.name || li.nameSnapshot;
              const src = li.image || FALLBACK_DISH_IMG;
              const lineTotal = li.unitPrice * li.qty;
              return (
                <li
                  key={`${li.menuItemId}-${li.nameSnapshot}-${li.qty}`}
                  className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/25 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_DISH_IMG;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-main truncate text-sm font-semibold text-foreground">{title}</p>
                    <p className="font-main mt-0.5 text-xs text-muted-foreground">
                      ${li.unitPrice.toFixed(2)} × {li.qty}
                    </p>
                  </div>
                  <p className="font-main shrink-0 text-sm font-bold tabular-nums text-primary">
                    ${lineTotal.toFixed(2)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
