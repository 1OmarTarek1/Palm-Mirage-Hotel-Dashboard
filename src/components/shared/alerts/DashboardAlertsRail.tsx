"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import DashboardAlertsPanel from "@/components/dashboard/DashboardAlertsPanel";
import { cn } from "@/lib/utils";
import { useDashboardAlertsContext } from "./dashboard-alerts-context";

interface DashboardAlertsRailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardAlertsRail({
  isOpen,
  onClose,
}: DashboardAlertsRailProps) {
  const { alertState } = useDashboardAlertsContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const desktopMediaQuery = window.matchMedia("(min-width: 1280px)");
    if (desktopMediaQuery.matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <aside className="hidden xl:block">
        <div
          className={cn(
            "fixed right-8 top-[6rem] z-[120] h-[calc(100vh-6rem-1.5rem)] w-[340px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isOpen
              ? "pointer-events-auto translate-x-0"
              : "pointer-events-none translate-x-[calc(100%+2rem)]"
          )}
        >
          <DashboardAlertsPanel
            title={alertState.title}
            description={alertState.description}
            alerts={alertState.alerts}
            emptyText="No active alerts for this page right now."
            className="flex h-full max-h-[calc(100vh-6rem)] flex-col overflow-hidden"
          />
        </div>
      </aside>

      {isMounted && typeof document !== "undefined"
        ? createPortal(
            <div
              className={cn(
                "fixed inset-0 z-[190] transition-opacity duration-300 xl:hidden",
                isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
              )}
              aria-hidden={!isOpen}
            >
              <button
                type="button"
                className="absolute inset-0 cursor-pointer bg-black/35 backdrop-blur-[2px]"
                onClick={onClose}
                aria-label="Close alerts panel"
              />

              <aside
                className={cn(
                  "absolute inset-y-0 right-0 flex h-screen w-[min(380px,calc(100vw-3rem))] flex-col border-l border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_12%,var(--background))_0%,var(--background)_22%,var(--background)_100%)] shadow-2xl backdrop-blur-md transition-transform duration-300",
                  isOpen ? "translate-x-0" : "translate-x-full"
                )}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div>
                    <p className="font-header text-base font-semibold text-foreground">Alerts</p>
                    <p className="font-main mt-1 text-xs text-muted-foreground">
                      Page-specific updates and attention items.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                    aria-label="Close alerts panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                  <DashboardAlertsPanel
                    title={alertState.title}
                    description={alertState.description}
                    alerts={alertState.alerts}
                    emptyText="No active alerts for this page right now."
                    className="flex min-h-full flex-col overflow-hidden"
                  />
                </div>
              </aside>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
