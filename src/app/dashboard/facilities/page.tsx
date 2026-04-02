export const metadata = {
  title: "Facility Management - Palm Mirage",
  description: "Manage hotel facilities, status, and availability.",
};

import FacilitiesTableClient from "@/components/Facilities/FacilitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";

interface FacilitiesPageProps {
  searchParams?: Promise<{
    modal?: string;
  }>;
}

export default async function FacilitiesPage({ searchParams }: FacilitiesPageProps) {
  const resolvedSearchParams = await searchParams;
  const shouldOpenAddModal = resolvedSearchParams?.modal === "add";

  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          title="Facility Management"
          description="Manage your hotel's facilities such as pools, spas, gyms, and dining areas. Update their availability and maintenance status."
          actionLabel="Add Facility"
          actionHref="/dashboard/facilities?modal=add"
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <FacilitiesTableClient initialOpenAddModal={shouldOpenAddModal} />
          </section>
        </div>
      </div>
    </div>
  );
}
