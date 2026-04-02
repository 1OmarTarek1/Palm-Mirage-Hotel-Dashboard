export const metadata = {
  title: "User Management - Palm Mirage",
  description: "Manage hotel users and administrators.",
};

import UserDashboardTableClient from "@/components/UserDashboard/UserDashboardTableClient";
import SubHeader from "@/components/shared/header/SubHeader";

interface UsersPageProps {
  searchParams?: Promise<{
    modal?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const resolvedSearchParams = await searchParams;
  const shouldOpenAddModal = resolvedSearchParams?.modal === "add";

  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          title="User Management"
          description="Manage your hotel's staff and registered users. Control roles and access permissions."
          actionLabel="Add User"
          actionHref="/dashboard/users?modal=add"
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <UserDashboardTableClient initialOpenAddModal={shouldOpenAddModal} />
          </section>
        </div>
      </div>
    </div>
  );
}
