import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import DashboardSectionCard from "@/components/shared/layouts/DashboardSectionCard";
import { MobileCardSkeleton } from "@/components/shared/table/MobileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardSubHeaderSkeletonProps {
  hasAction?: boolean;
}

interface DashboardOverviewSkeletonProps {
  cardCount?: number;
  className?: string;
}

interface DashboardTableSectionSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  mobileCardCount?: number;
  showFilters?: boolean;
}

interface DashboardTablePageSkeletonProps {
  overviewCount?: number;
  tableColumnCount?: number;
  tableRowCount?: number;
  hasHeaderAction?: boolean;
}

interface DashboardQuickActionsSkeletonProps {
  count?: number;
  className?: string;
}

interface DashboardManagementPageSkeletonProps {
  overviewCount?: number;
  tableColumnCount?: number;
  tableRowCount?: number;
  hasHeaderAction?: boolean;
  quickActionCount?: number;
  quickActionsClassName?: string;
}

const TABLE_COLUMN_WIDTHS = ["w-28", "w-36", "w-24", "w-20", "w-24", "w-16"];

function getColumnWidth(index: number) {
  return TABLE_COLUMN_WIDTHS[index % TABLE_COLUMN_WIDTHS.length];
}

export function DashboardSubHeaderSkeleton({
  hasAction = true,
}: DashboardSubHeaderSkeletonProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-9 w-52 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
      </div>

      {hasAction ? <Skeleton className="h-11 w-36 rounded-2xl" /> : null}
    </div>
  );
}

export function DashboardOverviewSkeleton({
  cardCount = 4,
  className,
}: DashboardOverviewSkeletonProps) {
  return (
    <section className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={`overview-skeleton-${index}`}
          className="rounded-[24px] border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_36%),var(--color-card)] px-4 py-4 shadow-sm"
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

export function DashboardQuickActionsSkeleton({
  count = 2,
  className,
}: DashboardQuickActionsSkeletonProps) {
  return (
    <div className={cn("mb-5 flex justify-start md:mb-6", className)}>
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={`quick-action-skeleton-${index}`} className="h-10 w-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardTableSectionSkeleton({
  columnCount = 5,
  rowCount = 6,
  mobileCardCount = 6,
  showFilters = true,
}: DashboardTableSectionSkeletonProps) {
  return (
    <DashboardSectionCard>
      <div className="w-full">
        <div className="sticky top-16 z-30 rounded-t-[28px] border-b border-border bg-card/95 py-3 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 flex-1 rounded-full lg:max-w-md xl:max-w-sm" />

              {showFilters ? (
                <>
                  <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
                    <Skeleton className="h-10 w-32 rounded-2xl" />
                    <Skeleton className="h-10 w-28 rounded-2xl" />
                    <Skeleton className="h-10 w-24 rounded-2xl" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-2xl lg:hidden" />
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="pt-3 lg:hidden">
          <div className="rounded-[30px] border border-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_4%,transparent),transparent_32%),var(--color-card)] p-3 shadow-inner shadow-black/[0.03]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: mobileCardCount }).map((_, index) => (
                <MobileCardSkeleton key={`dashboard-mobile-card-${index}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden max-h-[36rem] overflow-auto rounded-b-[30px] bg-card/30 lg:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/80 bg-card/85">
              <tr>
                {Array.from({ length: columnCount }).map((_, index) => (
                  <th key={`table-heading-skeleton-${index}`} className="px-6 py-4">
                    <Skeleton className={cn("h-4 rounded-full", getColumnWidth(index))} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={`table-row-skeleton-${rowIndex}`}>
                  {Array.from({ length: columnCount }).map((_, columnIndex) => (
                    <td key={`table-cell-skeleton-${rowIndex}-${columnIndex}`} className="px-6 py-4">
                      {columnIndex === 0 ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-2xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-28 rounded-full" />
                            <Skeleton className="h-3 w-20 rounded-full" />
                          </div>
                        </div>
                      ) : columnIndex === columnCount - 1 ? (
                        <Skeleton className="ml-auto h-8 w-8 rounded-xl" />
                      ) : (
                        <Skeleton
                          className={cn("h-4 rounded-full", getColumnWidth(rowIndex + columnIndex))}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 rounded-b-[28px] border-t border-border px-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-4 w-48 rounded-full" />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </DashboardSectionCard>
  );
}

export function DashboardTablePageSkeleton({
  overviewCount = 4,
  tableColumnCount = 5,
  tableRowCount = 6,
  hasHeaderAction = true,
}: DashboardTablePageSkeletonProps) {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
      <DashboardSubHeaderSkeleton hasAction={hasHeaderAction} />
      <div className="space-y-5 md:space-y-6">
        <DashboardOverviewSkeleton cardCount={overviewCount} />
        <DashboardTableSectionSkeleton
          columnCount={tableColumnCount}
          rowCount={tableRowCount}
          mobileCardCount={tableRowCount}
        />
      </div>
    </DashboardPageShell>
  );
}

export function DashboardManagementPageSkeleton({
  overviewCount = 4,
  tableColumnCount = 5,
  tableRowCount = 6,
  hasHeaderAction = true,
  quickActionCount = 0,
  quickActionsClassName,
}: DashboardManagementPageSkeletonProps) {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
      <DashboardSubHeaderSkeleton hasAction={hasHeaderAction} />
      {quickActionCount > 0 ? (
        <DashboardQuickActionsSkeleton
          count={quickActionCount}
          className={quickActionsClassName}
        />
      ) : null}
      <div className="space-y-5 md:space-y-6">
        <DashboardOverviewSkeleton cardCount={overviewCount} />
        <DashboardTableSectionSkeleton
          columnCount={tableColumnCount}
          rowCount={tableRowCount}
          mobileCardCount={tableRowCount}
        />
      </div>
    </DashboardPageShell>
  );
}

/** Home dashboard body only — use with real `DashboardHero` above for faster LCP. */
export function DashboardHomeBelowHeroSkeleton() {
  return (
    <>
      <DashboardOverviewSkeleton cardCount={4} />

      <section className="flex flex-wrap gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`dashboard-chart-skeleton-${index}`}
            className="min-w-[350px] flex-1 rounded-xl border bg-card p-3.5 shadow-sm md:p-4"
          >
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="mt-2 h-4 w-full max-w-[18rem] rounded-full" />
            <div className="mt-4 rounded-[18px] border border-border/60 bg-background/35 p-4">
              <Skeleton className="h-[210px] w-full rounded-[18px] md:h-[230px]" />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[22px] border bg-card p-3.5 shadow-sm md:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-4 w-full max-w-[20rem] rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`operations-card-${index}`}
              className="min-w-[220px] flex-1 basis-[240px] rounded-[18px] border border-primary/12 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_5%,transparent)_0%,transparent_100%)] p-3.5"
            >
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="mt-2 h-8 w-16 rounded-xl" />
              <Skeleton className="mt-2 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-2.5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`operations-highlight-${index}`}
              className="rounded-[16px] border border-border/70 bg-background p-3"
            >
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="mt-2 h-4 w-full rounded-full" />
              <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`list-panel-skeleton-${index}`}
            className="rounded-[22px] border bg-card p-3.5 shadow-sm md:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-4 w-full max-w-[18rem] rounded-full" />
              </div>
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>

            <div className="space-y-2">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div
                  key={`list-item-skeleton-${index}-${itemIndex}`}
                  className="rounded-[16px] border border-border/70 bg-background px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-28 rounded-full" />
                      <Skeleton className="h-4 w-full rounded-full" />
                    </div>
                    <div className="w-20 space-y-2">
                      <Skeleton className="ml-auto h-4 w-16 rounded-full" />
                      <Skeleton className="ml-auto h-4 w-12 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="flex flex-col items-center justify-between gap-3 rounded-[22px] border border-primary/20 bg-primary/5 p-4 md:flex-row md:p-5">
        <div className="w-full space-y-2">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
          <Skeleton className="h-4 w-5/6 max-w-xl rounded-full" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>
    </>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <DashboardPageShell className="space-y-5 md:space-y-6">
      <header className="relative overflow-hidden rounded-[22px] border border-primary/20 bg-card p-3.5 shadow-sm md:p-4">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary)_0%,var(--secondary)_100%)]" />
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative space-y-2.5">
          <Skeleton className="h-6 w-40 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-2xl rounded-full" />
            <Skeleton className="h-4 w-5/6 max-w-xl rounded-full" />
          </div>
        </div>
      </header>

      <DashboardHomeBelowHeroSkeleton />
    </DashboardPageShell>
  );
}
