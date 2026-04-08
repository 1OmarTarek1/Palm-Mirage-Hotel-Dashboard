"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityScheduleStatusOptions,
  type ActivityOption,
  type ActivityScheduleDraft,
} from "./data";

interface ActivityScheduleEditFormProps {
  schedule: ActivityScheduleDraft;
  activities: ActivityOption[];
  isEditing?: boolean;
  onChange: (schedule: ActivityScheduleDraft) => void;
}

const formatStatusLabel = (value: ActivityScheduleDraft["status"]) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default function ActivityScheduleEditForm({
  schedule,
  activities,
  isEditing = false,
  onChange,
}: ActivityScheduleEditFormProps) {
  const selectedActivity = useMemo(
    () => activities.find((activity) => activity.id === schedule.activityId) ?? null,
    [activities, schedule.activityId]
  );

  const handleChange = <K extends keyof ActivityScheduleDraft>(
    key: K,
    value: ActivityScheduleDraft[K]
  ) => {
    const updated = { ...schedule, [key]: value };
    onChange(updated);
  };

  const handleNumberChange = <K extends keyof ActivityScheduleDraft>(key: K, value: string) => {
    if (value === "") {
      handleChange(key, null as ActivityScheduleDraft[K]);
      return;
    }

    const parsed = Number(value);
    handleChange(key, (Number.isNaN(parsed) ? 0 : parsed) as ActivityScheduleDraft[K]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Activity</span>
          <Select
            value={schedule.activityId}
            onValueChange={(value) => handleChange("activityId", value)}
            disabled={isEditing}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity.id} value={activity.id}>
                  {activity.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {selectedActivity ? (
          <div className="rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-2">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="font-main text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Default Price</p>
                <p className="font-main mt-1 text-sm font-semibold text-foreground">
                  ${selectedActivity.basePrice}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="font-main text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Pricing</p>
                <p className="font-main mt-1 text-sm font-semibold text-foreground">
                  {selectedActivity.pricingType === "per_group" ? "Per Group" : "Per Person"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="font-main text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Default Capacity</p>
                <p className="font-main mt-1 text-sm font-semibold text-foreground">
                  {selectedActivity.defaultCapacity} guests
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card px-4 py-3">
                <p className="font-main text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <p className="font-main mt-1 text-sm font-semibold text-foreground">
                  {selectedActivity.location || "Hotel concierge"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Date</span>
          <input
            type="date"
            value={schedule.date}
            onChange={(event) => handleChange("date", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Status</span>
          <Select
            value={schedule.status}
            onValueChange={(value) => handleChange("status", value as ActivityScheduleDraft["status"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {activityScheduleStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Start Time</span>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(event) => handleChange("startTime", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">End Time</span>
          <input
            type="time"
            value={schedule.endTime}
            onChange={(event) => handleChange("endTime", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Capacity</span>
          <input
            type="number"
            min="1"
            value={schedule.capacity}
            onChange={(event) => handleNumberChange("capacity", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Available Seats</span>
          <input
            type="number"
            min="0"
            value={schedule.availableSeats}
            onChange={(event) => handleNumberChange("availableSeats", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Price Override</span>
          <input
            type="number"
            min="0"
            placeholder="Leave empty to use the activity base price"
            value={schedule.priceOverride ?? ""}
            onChange={(event) => handleNumberChange("priceOverride", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Notes</span>
          <textarea
            rows={4}
            value={schedule.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>
      </div>
    </div>
  );
}
