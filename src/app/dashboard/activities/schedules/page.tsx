import ActivitySchedulesTableClient from "@/components/ActivitySchedules/ActivitySchedulesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function ActivitySchedulesPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          title="Activity Schedules"
          description="Plan each activity session with live dates, seat counts, pricing overrides, and dashboard controls."
          actionLabel="Add Schedule"
          actionEvent={DASHBOARD_MODAL_EVENTS.activitySchedulesAdd}
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <ActivitySchedulesTableClient />
          </section>
        </div>
      </div>
    </div>
  );
}
