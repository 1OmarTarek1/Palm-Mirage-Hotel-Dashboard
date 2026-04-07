import { ClipboardList } from "lucide-react";

import type { DashboardOperationItem } from "./types";

interface DashboardOperationsSectionProps {
  operations: DashboardOperationItem[];
  highlights: {
    users: string;
    facilities: string;
    activities: string;
  };
}

export default function DashboardOperationsSection({
  operations,
  highlights,
}: DashboardOperationsSectionProps) {
  return (
    <div className="rounded-[22px] border bg-card p-3.5 shadow-sm md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-header text-base font-semibold md:text-lg">Today&apos;s Operations</h3>
          <p className="mt-0.5 font-main text-[11px] text-muted-foreground md:text-xs">
            What the front desk and operations team should keep an eye on today.
          </p>
        </div>
        <ClipboardList className="h-4 w-4 text-primary" />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {operations.map((item) => (
          <div
            key={item.label}
            className="min-w-[220px] flex-1 basis-[240px] rounded-[18px] border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_5%,transparent)_0%,transparent_100%)] p-3.5"
          >
            <p className="font-main text-[11px] text-muted-foreground md:text-xs">{item.label}</p>
            <p className="mt-1 font-header text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {item.value}
            </p>
            <p className="mt-1 font-main text-xs leading-5 text-muted-foreground md:text-sm">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-2.5 md:grid-cols-3">
        <HighlightCard label="Users" value={highlights.users} />
        <HighlightCard label="Facilities" value={highlights.facilities} />
        <HighlightCard label="Activities" value={highlights.activities} />
      </div>
    </div>
  );
}

function HighlightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-border/70 bg-background p-3">
      <p className="font-main text-[10px] uppercase tracking-[0.14em] text-primary/75">{label}</p>
      <p className="mt-1 font-main text-xs leading-5 text-foreground md:text-sm">{value}</p>
    </div>
  );
}
