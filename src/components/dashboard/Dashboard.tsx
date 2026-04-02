"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bed,
  Users,
  Building2,
  Calendar,
  ArrowRight,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import DashboardCharts from "./DashboardCharts";
import StatCard from "./StatCard";
import { getDashboardData } from "@/services/dashboard.service";

interface DashboardStat {
  title: string;
  value: string | number;
  iconName: keyof typeof ICON_MAP;
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
}

interface DashboardData {
  stats: DashboardStat[];
  charts: {
    occupancy: unknown;
    userRoles: unknown;
    trends: unknown;
  };
}

const ICON_MAP: Record<string, LucideIcon> = {
  Bed,
  Users,
  Building2,
  Calendar,
  Utensils,
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

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="font-main animate-pulse text-muted-foreground">Syncing with database...</p>
      </div>
    );
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
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 font-main text-primary-foreground transition-transform active:scale-95"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-8 p-6 fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h2 className="font-header text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="font-main text-muted-foreground">
          Welcome back! Your complete hotel management metrics are now live.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
        userData={data.charts.userRoles}
        trendData={data.charts.trends}
      />

      <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-primary/20 bg-primary/5 p-8 md:flex-row">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-header text-xl font-semibold text-primary">
            Need more detailed reports?
          </h3>
          <p className="max-w-md font-main text-muted-foreground">
            Check the specific management sections in the sidebar for complete data access and
            advanced filtering.
          </p>
        </div>
        <Link
          href="/dashboard/rooms"
          className="group flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-center font-main font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          View Detailed Analytics
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
