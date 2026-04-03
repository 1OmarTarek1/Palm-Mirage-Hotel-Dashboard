import RoomsTableClient from "@/components/Rooms/RoomsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import { Button } from "@/components/ui/button";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import Link from "next/link";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          title="Rooms Management"
          description="Manage your hotel's inventory of rooms, pricing, and availability."
          actionLabel="Add Room"
          actionEvent={DASHBOARD_MODAL_EVENTS.roomsAdd}
        />

        <div className="mb-6 flex justify-end">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/rooms/bookings">Manage Room Bookings</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <RoomsTableClient />
          </section>
        </div>
      </div>
    </div>
  );
}
