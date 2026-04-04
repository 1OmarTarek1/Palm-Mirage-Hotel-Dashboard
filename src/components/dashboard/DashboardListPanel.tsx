import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BasePanelProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  emptyText: string;
}

interface BookingPanelProps extends BasePanelProps {
  variant: "bookings";
  items: Array<{
    id: string;
    guestName: string;
    context: string;
    status: string;
    amount: string;
  }>;
}

interface ActivityPanelProps extends BasePanelProps {
  variant: "activities";
  items: Array<{
    id: string;
    title: string;
    context: string;
    status: string;
  }>;
}

type DashboardListPanelProps = BookingPanelProps | ActivityPanelProps;

function formatStatusLabel(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DashboardListPanel(props: DashboardListPanelProps) {
  return (
    <div className="rounded-[24px] border bg-card p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-header text-lg font-semibold">{props.title}</h3>
          <p className="mt-1 font-main text-xs text-muted-foreground md:text-sm">{props.description}</p>
        </div>

        <Button asChild variant="light" size="sm">
          <Link href={props.ctaHref}>{props.ctaLabel}</Link>
        </Button>
      </div>

      <div className="space-y-2.5">
        {props.items.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-border bg-muted/20 px-4 py-6 text-center font-main text-sm text-muted-foreground">
            {props.emptyText}
          </div>
        ) : props.variant === "bookings" ? (
          props.items.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-3 rounded-[18px] border border-border/70 bg-background px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-main text-sm font-medium text-foreground">{booking.guestName}</p>
                <p className="mt-0.5 truncate font-main text-xs text-muted-foreground md:text-sm">
                  {booking.context}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-main text-sm font-semibold text-foreground">{booking.amount}</p>
                <p className="mt-0.5 font-main text-[11px] text-muted-foreground md:text-xs">
                  {formatStatusLabel(booking.status)}
                </p>
              </div>
            </div>
          ))
        ) : (
          props.items.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between gap-3 rounded-[18px] border border-border/70 bg-background px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-main text-sm font-medium text-foreground">{activity.title}</p>
                <p className="mt-0.5 truncate font-main text-xs text-muted-foreground md:text-sm">
                  {activity.context}
                </p>
              </div>

              <div className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary md:text-xs">
                {activity.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
