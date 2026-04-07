import { AlertTriangle } from "lucide-react";

import type { DashboardAlert } from "./types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ALERT_STYLES = {
  critical: "border-destructive/20 bg-destructive/5 text-destructive",
  warning: "border-secondary/20 bg-secondary/10 text-secondary",
  info: "border-primary/20 bg-primary/5 text-primary",
} as const;

interface DashboardAlertsPanelProps {
  title?: string;
  description?: string;
  alerts: DashboardAlert[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export default function DashboardAlertsPanel({
  title = "Notifications",
  description = "Small issues here turn into missed revenue or guest friction later.",
  alerts,
  loading = false,
  emptyText = "No notifications right now.",
  className,
}: DashboardAlertsPanelProps) {
  return (
    <div className={cn("", className)}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-header text-xl font-semibold">{title}</h3>
          <p className="mt-1 font-main text-sm text-muted-foreground">{description}</p>
        </div>
        <AlertTriangle className="h-5 w-5 text-primary" />
      </div>

      <div className="grid gap-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`dashboard-alert-loading-${index}`}
              className="rounded-[22px] border border-border/60 bg-card/40 p-4"
            >
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="mt-2 h-3 w-full rounded-md" />
              <Skeleton className="mt-2 h-3 w-5/6 rounded-md" />
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-border bg-muted/20 px-4 py-8 text-center font-main text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div
              key={`${alert.title}-${index}`}
              className={`rounded-[22px] border p-4 ${ALERT_STYLES[alert.tone]}`}
            >
              <p className="font-main text-sm font-semibold">{alert.title}</p>
              <p className="mt-1 font-main text-sm leading-6 text-foreground/80 dark:text-foreground/85">
                {alert.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
