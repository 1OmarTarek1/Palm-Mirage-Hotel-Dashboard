import RestaurantBookingsTableClient from "@/components/RestaurantBookings/RestaurantBookingsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";

export default function RestaurantBookingsPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
      <SubHeader
        title="Restaurant Bookings"
        description="Monitor dining reservations, waitlist pressure, and table assignment status from one place."
      />

      <div className="space-y-5 md:space-y-6">
        <RestaurantBookingsTableClient />
      </div>
    </DashboardPageShell>
  );
}
