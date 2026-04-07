import ActivitiesTableClient from "@/components/Activities/ActivitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { CalendarRange, Ticket } from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
  return (
    <DashboardPageShell>
        <SubHeader
          description="Curate and manage your hotel's premium experiences and local adventures."
          actionLabel="Add Activity"
          actionEvent={DASHBOARD_MODAL_EVENTS.activitiesAdd}
        />

        <div className="mb-5 flex justify-start md:mb-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/activities/schedules">
                <CalendarRange className="h-4 w-4" />
                Schedules
              </Link>
            </Button>
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/activities/bookings">
                <Ticket className="h-4 w-4" />
                Bookings
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <ActivitiesTableClient />
        </div>
    </DashboardPageShell>
  );
}
 
