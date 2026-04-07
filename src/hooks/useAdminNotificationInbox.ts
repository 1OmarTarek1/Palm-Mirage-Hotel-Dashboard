"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { apiRequest } from "@/lib/api-client";
import {
  registerPersistedNotificationRefresh,
  unregisterPersistedNotificationRefresh,
} from "@/lib/persisted-notification-bridge";

export type AdminInboxItem = {
  id: string;
  title: string;
  message: string;
  severity: string;
  readAt: string | null;
  createdAt: string;
};

type ListResponse = {
  data?: {
    notifications: AdminInboxItem[];
    unreadCount: number;
  };
};

type UnreadResponse = {
  data?: { unreadCount: number };
};

export function useAdminNotificationInbox() {
  const { status } = useSession();
  const enabled = status === "authenticated";

  const [items, setItems] = useState<AdminInboxItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshUnreadOnly = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = (await apiRequest("/api/notifications/unread-count")) as UnreadResponse;
      setUnreadCount(res.data?.unreadCount ?? 0);
    } catch {
      /* session or network */
    }
  }, [enabled]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = (await apiRequest("/api/notifications?limit=40")) as ListResponse;
      const d = res.data;
      setItems(d?.notifications ?? []);
      setUnreadCount(d?.unreadCount ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const refreshRef = useRef(refreshUnreadOnly);
  refreshRef.current = refreshUnreadOnly;

  useEffect(() => {
    if (!enabled) return;

    const bridged = () => {
      void refreshRef.current();
    };

    registerPersistedNotificationRefresh(bridged);
    void refreshUnreadOnly();
    const interval = window.setInterval(() => void refreshRef.current(), 120_000);

    return () => {
      unregisterPersistedNotificationRefresh(bridged);
      window.clearInterval(interval);
    };
  }, [enabled, refreshUnreadOnly]);

  const markRead = useCallback(
    async (id: string) => {
      await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    await apiRequest("/api/notifications/read-all", { method: "POST" });
    await refresh();
  }, [refresh]);

  return { items, unreadCount, loading, refresh, markRead, markAllRead };
}
