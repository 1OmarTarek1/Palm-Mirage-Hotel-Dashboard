export const metadata = {
  title: "Menu Admin | Hotel Management Dashboard",
  description: "Manage hotel menu items and products.",
};

import MenuTableClient from "@/components/Menu/MenuTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function MenuPage() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
        <SubHeader
          title="Menu Admin"
          description="Manage your hotel's culinary offerings, from appetizers to desserts and drinks."
          actionLabel="Add Product"
          actionEvent={DASHBOARD_MODAL_EVENTS.menuAdd}
        />

        <div className="space-y-5 md:space-y-6">
          <MenuTableClient />
        </div>
    </DashboardPageShell>
  );
}
