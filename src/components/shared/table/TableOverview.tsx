import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type OverviewTone = "primary" | "secondary" | "destructive";

export interface TableOverviewItem {
  key: string;
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: OverviewTone;
}

interface TableOverviewProps {
  items: TableOverviewItem[];
  className?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

const TONE_STYLES: Record<OverviewTone, string> = {
  primary: "border-primary/15 bg-primary/5 text-primary",
  secondary: "border-secondary/20 bg-secondary/10 text-secondary",
  destructive: "border-destructive/15 bg-destructive/5 text-destructive",
};

export default function TableOverview({
  items,
  className,
  isLoading = false,
  skeletonCount,
}: TableOverviewProps) {
  const resolvedSkeletonCount = skeletonCount ?? Math.max(items.length, 4);

  if (!isLoading && items.length === 0) return null;

  if (isLoading) {
    return (
      <section className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>
        {Array.from({ length: resolvedSkeletonCount }).map((_, index) => (
          <div
            key={`table-overview-skeleton-${index}`}
            className="rounded-[24px] border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_36%),var(--color-card)] px-4 py-4 shadow-sm transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2.5">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-xl" />
                <Skeleton className="h-4 w-full max-w-[14rem] rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </div>

              <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const tone = item.tone ?? "primary";

        return (
          <div
            key={item.key}
            className="rounded-[24px] border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_36%),var(--color-card)] px-4 py-4 shadow-sm transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-main text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1.5 font-header text-[1.75rem] font-bold leading-none tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="mt-2 font-main text-sm leading-5 text-muted-foreground">
                  {item.helper}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${TONE_STYLES[tone]}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
