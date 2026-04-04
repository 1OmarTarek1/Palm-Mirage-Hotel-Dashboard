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
    <div className="rounded-[24px] border bg-card p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-header text-lg font-semibold">Today&apos;s Operations</h3>
          <p className="mt-1 font-main text-xs text-muted-foreground md:text-sm">
            What the front desk and operations team should keep an eye on today.
          </p>
        </div>
        <ClipboardList className="h-5 w-5 text-primary" />
      </div>

      <div className="flex flex-wrap gap-3">
        {operations.map((item) => (
          <div
            key={item.label}
            className="min-w-[240px] flex-1 basis-[260px] rounded-[20px] border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_5%,transparent)_0%,transparent_100%)] p-4"
          >
            <p className="font-main text-xs text-muted-foreground md:text-sm">{item.label}</p>
            <p className="mt-1.5 font-header text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
              {item.value}
            </p>
            <p className="mt-1.5 font-main text-sm leading-5 text-muted-foreground">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <HighlightCard label="Users" value={highlights.users} />
        <HighlightCard label="Facilities" value={highlights.facilities} />
        <HighlightCard label="Activities" value={highlights.activities} />
      </div>
    </div>
  );
}

function HighlightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-border/70 bg-background p-3.5">
      <p className="font-main text-[11px] uppercase tracking-[0.16em] text-primary/75">{label}</p>
      <p className="mt-1.5 font-main text-sm leading-5 text-foreground">{value}</p>
    </div>
  );
}
