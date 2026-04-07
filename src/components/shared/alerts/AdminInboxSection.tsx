"use client";

import type { AdminInboxItem } from "@/hooks/useAdminNotificationInbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

interface AdminInboxSectionProps {
  items: AdminInboxItem[];
  loading: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function AdminInboxSection({
  items,
  loading,
  onMarkRead,
  onMarkAllRead,
}: AdminInboxSectionProps) {
  const unread = items.filter((i) => !i.readAt);

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
          <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={() => onMarkAllRead()}>
            Mark all read
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p className="font-main py-4 text-center text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-main rounded-[22px] border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
          No inbox messages yet.
        </p>
      ) : (
        <ul className="grid gap-2">
          {items.map((item) => {
            const tone = severityToTone(item.severity);
            const isUnread = !item.readAt;
            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-[22px] border p-4 transition-opacity",
                  INBOX_STYLES[tone],
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
                  </div>
                  {isUnread ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 shrink-0 text-xs"
                      onClick={() => onMarkRead(item.id)}
                    >
                      Mark read
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
