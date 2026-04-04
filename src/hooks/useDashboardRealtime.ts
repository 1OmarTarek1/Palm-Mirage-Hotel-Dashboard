"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";

type UseDashboardRealtimeOptions = {
  enabled?: boolean;
  onPaymentUpdate?: () => void;
};

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000";

export function useDashboardRealtime({
  enabled = true,
  onPaymentUpdate,
}: UseDashboardRealtimeOptions) {
  const { data: session, status } = useSession();
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

    socket.on("dashboard.payment.updated", () => {
      onPaymentUpdate?.();
    });

    socketRef.current = socket;

    return () => {
      socket.off("dashboard.payment.updated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, onPaymentUpdate, session?.accessToken, session?.user?.role, status]);
}
