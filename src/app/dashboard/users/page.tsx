export const metadata = {
  title: "User Management - Palm Mirage",
  description: "Manage hotel users and administrators.",
};

import UserDashboardTableClient from "@/components/UserDashboard/UserDashboardTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import { DASHBOARD_MODAL_EVENTS } from "@/lib/modal-events";

export default function UsersPage() {
  return (
    <DashboardPageShell>
        <SubHeader
          title="User Management"
          description="Manage your hotel's staff and registered users. Control roles and access permissions."
          actionLabel="Add User"
          actionEvent={DASHBOARD_MODAL_EVENTS.usersAdd}
        />

        <div className="space-y-5 md:space-y-6">
          <UserDashboardTableClient />
        </div>
    </DashboardPageShell>
  );
}
