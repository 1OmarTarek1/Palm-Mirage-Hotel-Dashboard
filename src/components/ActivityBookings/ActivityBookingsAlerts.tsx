import DashboardAlertsPanel from "@/components/dashboard/DashboardAlertsPanel";
import type { DashboardAlert } from "@/components/dashboard/types";

interface ActivityBookingsAlertsProps {
  pendingBookings: number;
  unpaidBookings: number;
  sessionsToday: number;
  highAttendanceBookings: number;
  cancelledBookings: number;
}

export function buildActivityBookingAlerts({
  pendingBookings,
  unpaidBookings,
  sessionsToday,
  highAttendanceBookings,
  cancelledBookings,
}: ActivityBookingsAlertsProps) {
  const alerts: DashboardAlert[] = [];

  if (sessionsToday > 0) {
    alerts.push({
      title: "Today's activity board is live",
      message: `${sessionsToday} bookings are scheduled for today and should be checked against staff readiness and attendance lists.`,
      tone: "info" as const,
    });
  }

  if (pendingBookings > 0) {
    alerts.push({
      title: "Pending activity approvals",
      message: `${pendingBookings} activity bookings still need confirmation or manual review.`,
      tone: "warning" as const,
    });
  }

  if (unpaidBookings > 0) {
    alerts.push({
      title: "Outstanding activity payments",
      message: `${unpaidBookings} bookings are unpaid and may need collection before the session starts.`,
      tone: "critical" as const,
    });
  }

  if (highAttendanceBookings > 0) {
    alerts.push({
      title: "High-attendance sessions",
      message: `${highAttendanceBookings} bookings have 4+ guests and may need extra equipment or guide support.`,
      tone: "warning" as const,
    });
  }

  if (cancelledBookings > 0) {
    alerts.push({
      title: "Capacity reopened",
      message: `${cancelledBookings} bookings were cancelled or rejected and could free seats for waitlisted guests.`,
      tone: "info" as const,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "Activity operations look stable",
      message: "No urgent activity-booking alerts right now. The team can focus on guest experience and session preparation.",
      tone: "info" as const,
    });
  }

  return alerts;
}

export default function ActivityBookingsAlerts(props: ActivityBookingsAlertsProps) {
  return (
    <DashboardAlertsPanel
      title="Activity Alerts"
      description="Quick attention items for the recreation and guest-experience teams."
      alerts={buildActivityBookingAlerts(props)}
      emptyText="No urgent activity-booking alerts right now."
    />
  );
}
