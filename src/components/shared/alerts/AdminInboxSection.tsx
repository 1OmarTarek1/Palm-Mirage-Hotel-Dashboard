"use client";

import { useRouter } from "next/navigation";

import type { AdminInboxItem } from "@/hooks/useAdminNotificationInbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const INBOX_STYLES = {
  critical: "border-destructive/20 bg-destructive/5 text-destructive",
  warning: "border-secondary/20 bg-secondary/10 text-secondary",
  info: "border-primary/20 bg-primary/5 text-primary",
} as const;

function severityToTone(severity: string): keyof typeof INBOX_STYLES {
  if (severity === "error") return "critical";
  if (severity === "warning") return "warning";
  return "info";
}

function formatRelativeTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return d.toLocaleDateString();
}

function resolveAdminNotificationHref(item: AdminInboxItem) {
  if (item.resource === "room") return "/dashboard/rooms/bookings";
  if (item.resource === "activity") return "/dashboard/activities/bookings";
  if (item.resource === "restaurant") return "/dashboard/restaurant/bookings";

  if (item.resource === "payment_checkout") {
    const kind = typeof item.metadata?.kind === "string" ? item.metadata.kind : null;
    if (kind === "room") return "/dashboard/rooms/bookings";
    if (kind === "activity") return "/dashboard/activities/bookings";
    if (kind === "restaurant") return "/dashboard/restaurant/bookings";
  }

  return null;
}

interface AdminInboxSectionProps {
  items: AdminInboxItem[];
  loading: boolean;
  busy?: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteOne: (id: string) => void;
  onClearRead: () => void;
  onNotificationNavigate?: () => void;
}

export default function AdminInboxSection({
  items,
  loading,
  busy = false,
  onMarkRead,
  onMarkAllRead,
  onDeleteOne,
  onClearRead,
  onNotificationNavigate,
}: AdminInboxSectionProps) {
  const router = useRouter();
  const unread = items.filter((i) => !i.readAt);
  const readCount = Math.max(0, items.length - unread.length);

  const handleItemClick = async (item: AdminInboxItem) => {
    if (!item.readAt) {
      await Promise.resolve(onMarkRead(item.id));
    }

    const href = resolveAdminNotificationHref(item);
    if (href) {
      onNotificationNavigate?.();
      router.push(href);
    }
  };

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-header text-sm font-semibold text-foreground">Inbox</h4>
          <p className="font-main mt-0.5 text-xs text-muted-foreground">
            Booking and payment events (synced across sessions).
          </p>
        </div>
        {unread.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={busy}
            onClick={() => onMarkAllRead()}
          >
            Mark all read
          </Button>
        ) : readCount > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={busy}
            onClick={() => onClearRead()}
          >
            Clear read
          </Button>
        ) : null}
      </div>

      {loading ? (
        <ul className="grid gap-2" aria-label="Loading inbox notifications">
          {Array.from({ length: 4 }).map((_, index) => (
            <li
              key={`inbox-loading-${index}`}
              className="rounded-[22px] border border-border/60 bg-card/40 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-2.5">
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-5/6 rounded-md" />
                  <Skeleton className="h-2.5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 shrink-0 rounded-md" />
              </div>
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="font-main rounded-[22px] border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
          No inbox messages yet.
        </p>
      ) : (
        <ul className="grid gap-2">
          {items.map((item) => {
            const tone = severityToTone(item.severity);
            const isUnread = !item.readAt;
            const href = resolveAdminNotificationHref(item);
            const isClickable = Boolean(href) || isUnread;

            return (
              <li
                key={item.id}
                onClick={() => void handleItemClick(item)}
                className={cn(
                  "rounded-[22px] border p-4 transition-all duration-200 ease-out hover:bg-primary/5",
                  INBOX_STYLES[tone],
                  isClickable ? "cursor-pointer" : "cursor-default",
                  isUnread ? "opacity-100" : "opacity-75",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-main text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="font-main mt-1 text-sm leading-6 text-foreground/80">{item.message}</p>
                    <p className="font-main mt-2 text-[11px] text-muted-foreground">
                      {formatRelativeTime(item.createdAt)}
                      {item.readAt ? " · Read" : ""}
                    </p>
                    {href ? (
                      <p className="font-main mt-1 text-[11px] font-medium uppercase tracking-wide text-primary/80">
                        Open details
                      </p>
                    ) : null}
                  </div>
                  {isUnread ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-xs"
                      disabled={busy}
                      onClick={(event) => {
                        event.stopPropagation();
                        onMarkRead(item.id);
                      }}
                    >
                      Mark read
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-xs"
                      disabled={busy}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteOne(item.id);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
