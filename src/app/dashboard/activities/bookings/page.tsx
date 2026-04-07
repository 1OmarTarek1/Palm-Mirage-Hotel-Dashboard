import ActivityBookingsTableClient from "@/components/ActivityBookings/ActivityBookingsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";

export default function ActivityBookingsPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
        <SubHeader
          title="Activity Bookings"
          description="Review live activity reservations, follow up on approvals, and monitor session readiness."
        />

        <div className="space-y-5 md:space-y-6">
          <ActivityBookingsTableClient />
        </div>
    </DashboardPageShell>
  );
}
