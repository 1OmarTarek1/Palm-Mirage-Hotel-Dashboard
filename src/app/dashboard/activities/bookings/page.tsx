import ActivityBookingsTableClient from "@/components/ActivityBookings/ActivityBookingsTableClient";
import SubHeader from "@/components/shared/header/SubHeader";

export default function ActivityBookingsPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          title="Activity Bookings"
          description="Review live activity reservations, update statuses, and track payment progress."
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <ActivityBookingsTableClient />
          </section>
        </div>
      </div>
    </div>
  );
}
