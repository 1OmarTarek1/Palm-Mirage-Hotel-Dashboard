export const metadata = {
  title: "Facilities - Palm Mirage",
  description: "Manage hotel-wide facilities, status, and availability.",
};

import FacilitiesTableClient from "@/components/Facilities/FacilitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function FacilitiesPage() {
  return (
    <DashboardPageShell>
        <SubHeader
          title="Facilities"
          description="Manage property-wide facilities such as pools, spas, gyms, lounges, and shared hotel areas."
          actionLabel="Add Hotel Facility"
          actionEvent={DASHBOARD_MODAL_EVENTS.facilitiesAdd}
        />

        <div className="space-y-5 md:space-y-6">
          <FacilitiesTableClient />
        </div>
    </DashboardPageShell>
  );
}
