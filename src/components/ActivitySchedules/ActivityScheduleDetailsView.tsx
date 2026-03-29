"use client";

import { toast } from "react-toastify";
import type { ActivitySchedule } from "./data";

interface ActivityScheduleDetailsViewProps {
  schedule: ActivitySchedule;
}

export default function ActivityScheduleDetailsView({
  schedule,
}: ActivityScheduleDetailsViewProps) {
  const handleCopyScheduleId = async () => {
    try {
      await navigator.clipboard.writeText(schedule.id);
      toast.success("Schedule ID copied.");
    } catch {
      toast.error("Failed to copy Schedule ID.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-5 rounded-[28px] border border-border bg-muted/35 p-5">
          <div>
            <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {schedule.activityLabel}
            </p>
            <h3 className="font-header mt-2 text-2xl font-bold text-foreground">
              {schedule.activityTitle}
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Date</p>
              <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.date}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Time</p>
              <p className="font-main mt-1 text-sm font-semibold text-foreground">
                {schedule.startTime} - {schedule.endTime}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
              <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.capacity} guests</p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3">
              <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Available Seats</p>
              <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.availableSeats}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-4">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Schedule Notes</p>
            <p className="font-main mt-2 text-sm leading-7 text-muted-foreground">
              {schedule.notes || "No internal notes added for this session."}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-[28px] border border-border bg-muted/35 p-5">
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Resolved Price</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              ${schedule.resolvedPrice} / {schedule.pricingType === "per_group" ? "group" : "person"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Override Price</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {schedule.priceOverride === null ? "Using base price" : `$${schedule.priceOverride}`}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.status}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Location</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">
              {schedule.activityLocation || "Hotel concierge"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created At</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{schedule.createdAt}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Schedule ID</p>
            <button
              type="button"
              onClick={handleCopyScheduleId}
              title={schedule.id}
              className="font-main mt-1 block w-full cursor-pointer truncate text-left text-sm font-semibold text-foreground transition hover:text-primary"
            >
              {schedule.id}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
