import RestaurantTablesClient from "@/components/Restaurant/RestaurantTablesClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { Button } from "@/components/ui/button";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";
import { BookMarked, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function RestaurantPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
        <SubHeader
          title="Restaurant Tables"
          description="Manage dining tables and seat capacity for restaurant operations."
          actionLabel="Add Table"
          actionEvent={DASHBOARD_MODAL_EVENTS.restaurantTablesAdd}
        />

        <div className="flex justify-start">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/menu">
                <UtensilsCrossed className="h-4 w-4" />
                Menus
              </Link>
            </Button>
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/restaurant/bookings">
                <BookMarked className="h-4 w-4" />
                Bookings
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <RestaurantTablesClient />
        </div>
    </DashboardPageShell>
  );
}
