"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import DashboardAlertsPanel from "@/components/dashboard/DashboardAlertsPanel";
import AdminInboxSection from "@/components/shared/alerts/AdminInboxSection";
import type { AdminInboxItem } from "@/hooks/useAdminNotificationInbox";
import { cn } from "@/lib/utils";
import { useDashboardAlertsContext } from "./dashboard-alerts-context";

interface DashboardAlertsRailProps {
  isOpen: boolean;
  onClose: () => void;
  inboxItems: AdminInboxItem[];
  inboxLoading: boolean;
  onInboxMarkRead: (id: string) => void;
  onInboxMarkAllRead: () => void;
}

/**
 * Freeze background scroll without `overflow:hidden` on `html` — that breaks `position:sticky`
 * on the main dashboard sidebar (it re-binds to a non-scrolling ancestor and “jumps”).
 * This pattern keeps the visual scroll position via `body { position: fixed; top: -scrollY }`.
 */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const body = document.body;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;

      window.requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    };
  }, [locked]);
}

export default function DashboardAlertsRail({
  isOpen,
  onClose,
  inboxItems,
  inboxLoading,
  onInboxMarkRead,
  onInboxMarkAllRead,
}: DashboardAlertsRailProps) {
  const { alertState } = useDashboardAlertsContext();
  const [isMounted, setIsMounted] = useState(false);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isMounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-[180] bg-background/55 backdrop-blur-[2px] transition-opacity duration-300 ease-out",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-alerts-rail-title"
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-y-0 end-0 z-[190] flex w-full max-w-[380px] flex-col border-border bg-background shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          "border-s pt-[env(safe-area-inset-top,0px)]",
          isOpen ? "pointer-events-auto translate-x-0" : "pointer-events-none translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p id="dashboard-alerts-rail-title" className="font-header text-base font-semibold text-foreground">
              Notifications
            </p>
            <p className="font-main mt-1 text-xs text-muted-foreground">
              Page-specific updates and items that need attention.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
            aria-label="Close notifications panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <DashboardAlertsPanel
            title={alertState.title}
            description={alertState.description}
            alerts={alertState.alerts}
            emptyText="No notifications for this page right now."
            className="border-0 p-0 shadow-none"
          />
          <AdminInboxSection
            items={inboxItems}
            loading={inboxLoading}
            onMarkRead={onInboxMarkRead}
            onMarkAllRead={onInboxMarkAllRead}
          />
        </div>
      </aside>
    </>,
    document.body,
  );
}
