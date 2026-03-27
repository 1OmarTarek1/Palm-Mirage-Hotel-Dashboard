"use client";

import { useRef } from "react";
import ActivitiesTableClient, {
  type ActivitiesTableClientHandle,
} from "@/components/Activities/ActivitiesTableClient";
import SubHeader from "@/components/shared/header/SubHeader";

export default function ActivitiesPageClient() {
  const tableRef = useRef<ActivitiesTableClientHandle>(null);

  return (
    <div className="min-h-screen bg-background px-6 py-8 text-foreground transition-colors duration-300 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <SubHeader
          description="Curate and manage your hotel's premium experiences and local adventures."
          actionLabel="Add Activity"
          onAction={() => tableRef.current?.openAddModal()}
        />

        <div className="space-y-6">
          <section className="rounded-[40px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300">
            <ActivitiesTableClient ref={tableRef} />
          </section>
        </div>
      </div>
    </div>
  );
}
