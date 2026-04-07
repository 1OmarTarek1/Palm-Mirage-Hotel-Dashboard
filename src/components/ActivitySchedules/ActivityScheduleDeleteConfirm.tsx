"use client";

import type { ActivitySchedule } from "./data";

interface ActivityScheduleDeleteConfirmProps {
  schedule: ActivitySchedule;
}

export default function ActivityScheduleDeleteConfirm({
  schedule,
}: ActivityScheduleDeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-red-200/70 bg-red-500/10 p-5">
        <p className="font-main text-sm font-semibold uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
          Delete Activity Schedule
        </p>
        <h3 className="font-header mt-2 text-xl font-bold text-foreground">
          {schedule.activityTitle}
        </h3>
        <p className="font-main mt-3 text-sm leading-7 text-muted-foreground">
          This session on {schedule.date} at {schedule.startTime} will be removed from the dashboard and the booking flow.
        </p>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-border bg-muted/35 p-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Resolved Price</p>
          <p className="font-main mt-1 text-sm font-semibold text-foreground">${schedule.resolvedPrice}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Available Seats</p>
          <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.availableSeats}</p>
        </div>
      </div>
    </div>
  );
}
