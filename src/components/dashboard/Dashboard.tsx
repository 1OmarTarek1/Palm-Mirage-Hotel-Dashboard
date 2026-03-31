"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bed, Users, Building2, Calendar, ArrowRight, Utensils } from "lucide-react";
import StatCard from "./StatCard";
import DashboardCharts from "./DashboardCharts";
import { getDashboardData } from "@/services/dashboard.service";

const ICON_MAP: Record<string, any> = {
  Bed,
  Users,
  Building2,
  Calendar,
  Utensils,
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
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

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Syncing with database...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <Building2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted-foreground max-w-md mb-6">{error || "No data available."}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md transition-transform active:scale-95"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Your complete hotel management metrics are now live.
        </p>
      </header>

      {/* Stats Grid - 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {data.stats.map((stat: any, index: number) => (
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

      {/* Charts Section */}
      <DashboardCharts
        occupancyData={data.charts.occupancy}
        userData={data.charts.userRoles}
        trendData={data.charts.trends}
      />
      
      {/* Additional Quick Actions or Info could go here */}
      <div className="bg-primary/5 rounded-xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-semibold text-primary">Need more detailed reports?</h3>
          <p className="text-muted-foreground max-w-md">
            Check the specific management sections in the sidebar for complete data access and advanced filtering.
          </p>
        </div>
        <Link 
          href="/dashboard/rooms"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group text-center"
        >
          View Detailed Analytics
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
