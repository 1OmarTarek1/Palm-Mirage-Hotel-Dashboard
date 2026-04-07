import RoomAmenitiesTableClient from "@/components/RoomAmenities/RoomAmenitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export const metadata = {
  title: "Room Amenities - Palm Mirage",
  description: "Manage the dynamic amenities that appear on room cards and room details.",
};

export default function RoomAmenitiesPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
        <SubHeader
          title="Room Amenities"
          description="Manage the dynamic amenity chips assigned to each room, such as Wi-Fi, air conditioning, minibar, and TV."
          actionLabel="Add Amenity"
          actionEvent={DASHBOARD_MODAL_EVENTS.roomAmenitiesAdd}
        />

        <RoomAmenitiesTableClient />
    </DashboardPageShell>
  );
}
