import type { DashboardAlert } from "@/components/dashboard/types";

interface RestaurantBookingsAlertsProps {
  pendingBookings: number;
  unassignedBookings: number;
  largePartyBookings: number;
  completedToday: number;
}

export function buildRestaurantBookingAlerts({
  pendingBookings,
  unassignedBookings,
  largePartyBookings,
  completedToday,
}: RestaurantBookingsAlertsProps) {
  const alerts: DashboardAlert[] = [];

  if (pendingBookings > 0) {
    alerts.push({
      title: "Pending restaurant bookings",
      message: `${pendingBookings} reservations are still pending and may need quick host review.`,
      tone: "warning",
    });
  }

  if (unassignedBookings > 0) {
    alerts.push({
      title: "Tables still unassigned",
      message: `${unassignedBookings} bookings do not have a table number yet and may still be on the waitlist.`,
      tone: "critical",
    });
  }

  if (largePartyBookings > 0) {
    alerts.push({
      title: "Large party attention",
      message: `${largePartyBookings} bookings have 5+ guests and may need table combinations or advance setup.`,
      tone: "warning",
    });
  }

  if (completedToday > 0) {
    alerts.push({
      title: "Completed seatings today",
      message: `${completedToday} restaurant bookings were already completed today.`,
      tone: "info",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "Restaurant floor looks stable",
      message: "No urgent restaurant-booking alerts right now.",
      tone: "info",
    });
  }

  return alerts;
}
