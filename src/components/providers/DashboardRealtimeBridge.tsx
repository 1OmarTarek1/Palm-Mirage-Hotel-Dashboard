"use client";

import { useDashboardRealtime } from "@/hooks/useDashboardRealtime";

/**
 * Keeps a single admin socket on all /dashboard routes so operational queries refetch
 * after booking/payment events even when the home dashboard is not mounted.
 */
export default function DashboardRealtimeBridge() {
  useDashboardRealtime({ enabled: true });
  return null;
}
