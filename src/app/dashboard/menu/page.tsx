export const metadata = {
  title: "Menu Admin | Hotel Management Dashboard",
  description: "Manage hotel menu items and products.",
};

import MenuTableClient from "@/components/Menu/MenuTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl md:space-y-6">
        <SubHeader
          title="Menu Admin"
          description="Manage your hotel's culinary offerings, from appetizers to desserts and drinks."
          actionLabel="Add Product"
          actionEvent={DASHBOARD_MODAL_EVENTS.menuAdd}
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <MenuTableClient />
          </section>
        </div>
      </div>
    </div>
  );
}
