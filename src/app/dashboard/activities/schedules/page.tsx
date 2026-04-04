import ActivitySchedulesTableClient from "@/components/ActivitySchedules/ActivitySchedulesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function ActivitySchedulesPage() {
  return (
    <DashboardPageShell>
        <SubHeader
          title="Activity Schedules"
          description="Plan each activity session with live dates, seat counts, pricing overrides, and dashboard controls."
          actionLabel="Add Schedule"
          actionEvent={DASHBOARD_MODAL_EVENTS.activitySchedulesAdd}
        />

        <div className="space-y-5 md:space-y-6">
          <ActivitySchedulesTableClient />
        </div>
    </DashboardPageShell>
  );
}
