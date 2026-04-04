"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bed, Building2, Calendar, ClipboardList, CreditCard, Users, type LucideIcon } from "lucide-react";

import { useDashboardAlerts } from "@/components/shared/alerts/dashboard-alerts-context";
import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import DashboardCharts from "./DashboardCharts";
import DashboardHero from "./DashboardHero";
import DashboardListPanel from "./DashboardListPanel";
import DashboardOperationsSection from "./DashboardOperationsSection";
import StatCard from "./StatCard";
import type { DashboardData } from "./types";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/services/dashboard.service";
import { DashboardHomeSkeleton } from "@/components/shared/loading/DashboardSkeleton";

const ICON_MAP: Record<string, LucideIcon> = {
  Bed,
  Users,
  Building2,
  Calendar,
  CreditCard,
  ClipboardList,
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getDashboardData()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Dashboard failed to load:", err);
          setError("Failed to load dashboard data. Please try again later.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useDashboardAlerts(
    data
      ? {
          title: "Alerts & Attention",
          description: "Small issues here turn into missed revenue or guest friction later.",
          alerts: data.alerts,
        }
      : null
  );

  if (loading) {
    return <DashboardHomeSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Building2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 font-header text-xl font-semibold">Something went wrong</h3>
        <p className="mb-6 max-w-md font-main text-muted-foreground">
          {error || "No data available."}
        </p>
        <Button variant="palmPrimary" onClick={() => window.location.reload()}>
          Try Refreshing
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <DashboardPageShell className="space-y-5 md:space-y-6">
        <DashboardHero
          lastUpdated={data.lastUpdated}
          paymentsFocus={data.highlights.payments}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <section className="grid gap-4 xl:grid-cols-2">
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

        <div className="flex flex-col items-center justify-between gap-4 rounded-[24px] border border-primary/20 bg-primary/5 p-5 md:flex-row md:p-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="font-header text-lg font-semibold text-primary">Dive into operations</h3>
            <p className="max-w-xl font-main text-sm text-muted-foreground">
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
    </div>
  );
}
