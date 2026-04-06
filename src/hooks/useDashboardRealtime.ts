"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";

import {
  invalidateBookingOperationalQueries,
  invalidatePaymentOperationalQueries,
} from "@/lib/dashboardRealtimeInvalidation";
import { triggerPersistedNotificationRefresh } from "@/lib/persisted-notification-bridge";

type UseDashboardRealtimeOptions = {
  enabled?: boolean;
  onPaymentUpdate?: (payload?: DashboardPaymentRealtimePayload) => void;
  onBookingUpdate?: (payload?: DashboardBookingRealtimePayload) => void;
};

export type DashboardBookingRealtimePayload = {
  resource?: "room" | "activity" | "restaurant";
  action?: string;
  bookingId?: string | null;
  bookingIds?: string[];
  userId?: string | null;
  source?: string;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
};

export type DashboardPaymentRealtimePayload = {
  checkoutId?: string;
  sessionId?: string;
  status?: string;
  paymentStatus?: string;
  expiresAt?: string;
  fulfilledAt?: string;
  amountTotal?: number;
  currency?: string;
};

const SOCKET_SERVER_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "http://localhost:5000"
    : process.env.NEXT_PUBLIC_API_BASE_URL;

export function useDashboardRealtime({
  enabled = true,
  onPaymentUpdate,
  onBookingUpdate,
}: UseDashboardRealtimeOptions) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || status !== "authenticated" || !session?.accessToken) {
      return;
    }

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        accessToken: session.accessToken,
        authScheme: session.user?.role === "admin" ? "System" : "Bearer",
      },
    });

    socket.on("dashboard.payment.updated", (payload: DashboardPaymentRealtimePayload) => {
      onPaymentUpdate?.(payload);
      triggerPersistedNotificationRefresh();
      invalidatePaymentOperationalQueries(queryClient);
    });

    socket.on("dashboard.booking.updated", (payload: DashboardBookingRealtimePayload) => {
      onBookingUpdate?.(payload);
      triggerPersistedNotificationRefresh();
      invalidateBookingOperationalQueries(queryClient, payload);
    });

    socketRef.current = socket;

    return () => {
      socket.off("dashboard.payment.updated");
      socket.off("dashboard.booking.updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    enabled,
    onBookingUpdate,
    onPaymentUpdate,
    queryClient,
    session?.accessToken,
    session?.user?.role,
    status,
  ]);
}
