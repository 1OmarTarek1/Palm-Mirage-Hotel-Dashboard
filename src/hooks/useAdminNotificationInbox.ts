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
  type?: string | null;
  resource?: string | null;
  action?: string | null;
  bookingIds?: string[];
  metadata?: Record<string, unknown> | null;
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
  const [mutating, setMutating] = useState(false);
  const pendingMarkAllReadRef = useRef<Promise<void> | null>(null);

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

  const refreshListRef = useRef(refresh);
  refreshListRef.current = refresh;

  const refreshUnreadRef = useRef(refreshUnreadOnly);
  refreshUnreadRef.current = refreshUnreadOnly;

  useEffect(() => {
    if (!enabled) return;

    const bridged = () => {
      void refreshListRef.current();
    };

    registerPersistedNotificationRefresh(bridged);
    void refreshUnreadOnly();
    const interval = window.setInterval(() => void refreshUnreadRef.current(), 120_000);

    return () => {
      unregisterPersistedNotificationRefresh(bridged);
      window.clearInterval(interval);
    };
  }, [enabled, refreshUnreadOnly]);

  const markRead = useCallback(
    async (id: string) => {
      const now = new Date().toISOString();
      const prevItemsSnapshot = items;
      const wasUnread = items.some((item) => item.id === id && !item.readAt);

      // Optimistic local update so Inbox doesn't switch to loading state.
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? now } : item)),
      );
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      try {
        await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
      } catch {
        setItems(prevItemsSnapshot);
        void refreshUnreadOnly();
      }
    },
    [items, refreshUnreadOnly],
  );

  const markAllRead = useCallback(async () => {
    if (pendingMarkAllReadRef.current) {
      await pendingMarkAllReadRef.current;
      return;
    }

    const prevItemsSnapshot = items;
    const prevUnreadSnapshot = unreadCount;
    const now = new Date().toISOString();
    setItems((prev) => prev.map((item) => (item.readAt ? item : { ...item, readAt: now })));
    setUnreadCount(0);

    const request = (async () => {
      setMutating(true);
      try {
        await apiRequest("/api/notifications/read-all", { method: "POST" });
      } catch {
        setItems(prevItemsSnapshot);
        setUnreadCount(prevUnreadSnapshot);
      } finally {
        setMutating(false);
        pendingMarkAllReadRef.current = null;
      }
    })();

    pendingMarkAllReadRef.current = request;
    await request;
  }, [items, unreadCount]);

  const deleteOne = useCallback(async (id: string) => {
    const prevItemsSnapshot = items;
    const prevUnreadSnapshot = unreadCount;
    const target = items.find((item) => item.id === id);
    const wasUnread = Boolean(target && !target.readAt);

    setItems((prev) => prev.filter((item) => item.id !== id));
    if (wasUnread) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      setMutating(true);
      await apiRequest(`/api/notifications/${id}`, { method: "DELETE" });
    } catch {
      setItems(prevItemsSnapshot);
      setUnreadCount(prevUnreadSnapshot);
    } finally {
      setMutating(false);
    }
  }, [items, unreadCount]);

  const clearRead = useCallback(async () => {
    if (pendingMarkAllReadRef.current) {
      await pendingMarkAllReadRef.current;
    }

    const prevItemsSnapshot = items;
    setItems((prev) => prev.filter((item) => !item.readAt));

    try {
      setMutating(true);
      await apiRequest("/api/notifications/clear-read", { method: "POST" });
    } catch {
      setItems(prevItemsSnapshot);
    } finally {
      setMutating(false);
    }
  }, [items]);

  return { items, unreadCount, loading, mutating, refresh, markRead, markAllRead, deleteOne, clearRead };
}
