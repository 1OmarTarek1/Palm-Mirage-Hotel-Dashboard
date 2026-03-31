import ActivitiesTableClient from "@/components/Activities/ActivitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActivitiesPageProps {
  searchParams?: Promise<{
    modal?: string;
  }>;
}

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const resolvedSearchParams = await searchParams;
  const shouldOpenAddModal = resolvedSearchParams?.modal === "add";

  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          description="Curate and manage your hotel's premium experiences and local adventures."
          actionLabel="Add Activity"
          actionHref="/dashboard/activities?modal=add"
        />

        <div className="mb-6 flex justify-end">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/activities/schedules">Manage Activity Schedules</Link>
            </Button>
            <Button asChild variant="palmSecondary">
              <Link href="/dashboard/activities/bookings">Manage Activity Bookings</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <ActivitiesTableClient initialOpenAddModal={shouldOpenAddModal} />
          </section>
        </div>
      </div>
    </div>
  );
}
