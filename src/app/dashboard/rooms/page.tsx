import RoomsTableClient from "@/components/Rooms/RoomsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { Sparkles, Ticket } from "lucide-react";
import Link from "next/link";

export default function RoomsPage() {
  return (
    <DashboardPageShell>
        <SubHeader
          title="Rooms Management"
          description="Manage your hotel's inventory of rooms, pricing, and availability."
          actionLabel="Add Room"
          actionEvent={DASHBOARD_MODAL_EVENTS.roomsAdd}
        />

        <div className="mb-5 flex justify-start md:mb-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/rooms/bookings">
                <Ticket className="h-4 w-4" />
                Bookings
              </Link>
            </Button>
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/rooms/amenities">
                <Sparkles className="h-4 w-4" />
                Amenities
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <RoomsTableClient />
        </div>
    </DashboardPageShell>
  );
}
