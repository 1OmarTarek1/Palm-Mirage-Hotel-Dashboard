import DashboardAlertsPanel from "@/components/dashboard/DashboardAlertsPanel";
import type { DashboardAlert } from "@/components/dashboard/types";

interface RoomBookingsAlertsProps {
  pendingBookings: number;
  unpaidBookings: number;
  noShowBookings: number;
  cancelledBookings: number;
}

export function buildRoomBookingAlerts({
  pendingBookings,
  unpaidBookings,
  noShowBookings,
  cancelledBookings,
}: RoomBookingsAlertsProps) {
  const alerts: DashboardAlert[] = [];

  if (pendingBookings > 0) {
    alerts.push({
      title: "Pending confirmation queue",
      message: `${pendingBookings} bookings still need manual confirmation or follow-up.`,
      tone: "warning" as const,
    });
  }

  if (unpaidBookings > 0) {
    alerts.push({
      title: "Unpaid reservations",
      message: `${unpaidBookings} bookings are still unpaid and may need collection before arrival.`,
      tone: "critical" as const,
    });
  }

  if (noShowBookings > 0) {
    alerts.push({
      title: "No-show reservations",
      message: `${noShowBookings} reservations are marked as no-show and should be reviewed for release or charge policy.`,
      tone: "info" as const,
    });
  }

  if (cancelledBookings > 0) {
    alerts.push({
      title: "Cancelled stays",
      message: `${cancelledBookings} bookings were cancelled and may have reopened inventory.`,
      tone: "info" as const,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "Room operations look stable",
      message: "No urgent booking alerts right now. The desk can focus on guest service and arrivals.",
      tone: "info" as const,
    });
  }

  return alerts;
}

export default function RoomBookingsAlerts(props: RoomBookingsAlertsProps) {
  return (
    <DashboardAlertsPanel
      title="Booking notifications"
      description="Quick attention items for the reservations and front-office teams."
      alerts={buildRoomBookingAlerts(props)}
      emptyText="No urgent booking notifications right now."
    />
  );
}
