"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Bed, Building2, Calendar, ClipboardList, CreditCard, Users, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import DashboardHero from "./DashboardHero";
import DashboardListPanel from "./DashboardListPanel";
import DashboardOperationsSection from "./DashboardOperationsSection";
import StatCard from "./StatCard";
import type { DashboardData } from "./types";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/services/dashboard.service";
import { DashboardHomeBelowHeroSkeleton } from "@/components/shared/loading/DashboardSkeleton";
import { queryKeys } from "@/lib/queryKeys";

const DashboardCharts = dynamic(() => import("./DashboardCharts"), {
  ssr: false,
  loading: () => (
    <div
      className="grid min-h-[280px] gap-3 md:grid-cols-2 xl:grid-cols-3"
      aria-hidden
    >
      <div className="h-[220px] animate-pulse rounded-[22px] bg-muted/40 md:col-span-1" />
      <div className="h-[220px] animate-pulse rounded-[22px] bg-muted/40 md:col-span-1" />
      <div className="h-[220px] animate-pulse rounded-[22px] bg-muted/40 md:col-span-2 xl:col-span-1" />
    </div>
  ),
});

const ICON_MAP: Record<string, LucideIcon> = {
  Bed,
  Users,
  Building2,
  Calendar,
  CreditCard,
  ClipboardList,
};

export default function Dashboard() {
  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery<DashboardData>({
    queryKey: queryKeys.dashboardHome.stats,
    queryFn: getDashboardData,
    staleTime: 30_000,
  });

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Failed to load dashboard data. Please try again later."
    : null;

  useDashboardAlerts(
    data
      ? {
          title: "Notifications & attention",
          description: "Small issues here turn into missed revenue or guest friction later.",
          alerts: data.alerts,
        }
      : null
  );

  if (loading) {
    return (
      <DashboardPageShell className="space-y-4 md:space-y-5">
        <DashboardHero />
        <DashboardHomeBelowHeroSkeleton />
      </DashboardPageShell>
    );
  }

  if (errorMessage || !data) {
    return (
      <DashboardPageShell className="space-y-4 md:space-y-5">
        <DashboardHero />
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[22px] border border-border bg-card p-6 text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-4">
            <Building2 className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mb-2 font-header text-xl font-semibold">Something went wrong</h3>
          <p className="mb-6 max-w-md font-main text-muted-foreground">
            {errorMessage || "No data available."}
          </p>
          <Button variant="palmPrimary" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell className="space-y-4 md:space-y-5">
      <DashboardHero />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat, index: number) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={ICON_MAP[stat.iconName]}
            trend={stat.trend}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      <DashboardCharts
        occupancyData={data.charts.occupancy}
        bookingStatusData={data.charts.bookingStatus}
        trendData={data.charts.trends}
      />

      <DashboardOperationsSection
        operations={data.operations}
        highlights={{
          users: data.highlights.users,
          facilities: data.highlights.facilities,
          activities: data.highlights.activities,
        }}
      />

      <section className="grid gap-3 xl:grid-cols-2">
        <DashboardListPanel
          variant="bookings"
          title="Latest Room Bookings"
          description="Recent guest activity coming into the property."
          ctaLabel="Open bookings"
          ctaHref="/dashboard/rooms/bookings"
          emptyText="No room bookings available yet."
          items={data.recentRoomBookings}
        />
        <DashboardListPanel
          variant="activities"
          title="Today's Activity Board"
          description="Upcoming sessions and how close they are to full capacity."
          ctaLabel="View schedules"
          ctaHref="/dashboard/activities/schedules"
          emptyText="No activity sessions scheduled for today."
          items={data.upcomingActivities}
        />
      </section>

      <div className="flex flex-col items-center justify-between gap-3 rounded-[22px] border border-primary/20 bg-primary/5 p-4 md:flex-row md:p-5">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-header text-base font-semibold text-primary md:text-lg">Dive into operations</h3>
          <p className="max-w-xl font-main text-xs text-muted-foreground md:text-sm">
            From here, the next strongest upgrade is turning each management page into a summary
            view plus a table, not just a table alone.
          </p>
        </div>
        <Button asChild variant="palmPrimary">
          <Link href="/dashboard/rooms/bookings">
            Open Room Operations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </DashboardPageShell>
  );
}
