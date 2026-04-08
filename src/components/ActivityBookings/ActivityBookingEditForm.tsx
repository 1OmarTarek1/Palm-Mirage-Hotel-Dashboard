"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityBookingPaymentStatusOptions,
  activityBookingStatusOptions,
  type ActivityBookingDraft,
} from "./data";

interface ActivityBookingEditFormProps {
  booking: ActivityBookingDraft;
  onChange: (booking: ActivityBookingDraft) => void;
}

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function ActivityBookingEditForm({
  booking,
  onChange,
}: ActivityBookingEditFormProps) {
  const handleChange = <K extends keyof ActivityBookingDraft>(
    key: K,
    value: ActivityBookingDraft[K]
  ) => {
    const updated = { ...booking, [key]: value };
    onChange(updated);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="space-y-2">
        <span className="font-main text-sm font-semibold text-foreground">Status</span>
        <Select
          value={booking.status}
          onValueChange={(value) => handleChange("status", value as ActivityBookingDraft["status"])}
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {activityBookingStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {formatLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="space-y-2">
        <span className="font-main text-sm font-semibold text-foreground">Payment Status</span>
        <Select
          value={booking.paymentStatus}
          onValueChange={(value) =>
            handleChange("paymentStatus", value as ActivityBookingDraft["paymentStatus"])
          }
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            {activityBookingPaymentStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {formatLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="font-main text-sm font-semibold text-foreground">Cancellation Reason</span>
        <textarea
          rows={4}
          value={booking.cancellationReason}
          onChange={(event) => handleChange("cancellationReason", event.target.value)}
          className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
        />
      </label>
    </div>
  );
}
