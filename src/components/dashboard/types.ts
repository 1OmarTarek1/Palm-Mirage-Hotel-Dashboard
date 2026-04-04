import type { ChartData } from "chart.js";

export interface DashboardStat {
  title: string;
  value: string | number;
  iconName: "Bed" | "Users" | "Building2" | "Calendar" | "CreditCard" | "ClipboardList";
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
}

export interface DashboardOperationItem {
  label: string;
  value: string | number;
  helper: string;
}

export interface DashboardAlert {
  title: string;
  message: string;
  tone: "critical" | "warning" | "info";
}

export interface DashboardBookingListItem {
  id: string;
  guestName: string;
  context: string;
  status: string;
  amount: string;
}

export interface DashboardActivityListItem {
  id: string;
  title: string;
  context: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  charts: {
    occupancy: ChartData<"doughnut", number[], string>;
    bookingStatus: ChartData<"bar", number[], string>;
    trends: ChartData<"line", number[], string>;
  };
  operations: DashboardOperationItem[];
  alerts: DashboardAlert[];
  highlights: {
    users: string;
    facilities: string;
    activities: string;
    payments: string;
  };
  recentRoomBookings: DashboardBookingListItem[];
  upcomingActivities: DashboardActivityListItem[];
  lastUpdated: string;
}
