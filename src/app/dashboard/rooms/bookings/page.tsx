import RoomBookingsTableClient from "@/components/RoomBookings/RoomBookingsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";

export default async function RoomBookingsPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
        <SubHeader
          title="Room Bookings"
          description="Track arrivals, departures, payment follow-up, and guest stay activity from one place."
        />

        <div className="space-y-5 md:space-y-6">
          <RoomBookingsTableClient />
        </div>
    </DashboardPageShell>
  );
}
