"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  roomBookingPaymentStatusOptions,
  roomBookingStatusOptions,
  type RoomBookingDraft,
} from "./data";

interface RoomBookingEditFormProps {
  booking: RoomBookingDraft;
  onChange: (booking: RoomBookingDraft) => void;
}

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");

export default function RoomBookingEditForm({
  booking,
  onChange,
}: RoomBookingEditFormProps) {
  const [formData, setFormData] = useState<RoomBookingDraft>(booking);

  useEffect(() => {
    setFormData(booking);
  }, [booking]);

  const handleChange = <K extends keyof RoomBookingDraft>(
    key: K,
    value: RoomBookingDraft[K]
  ) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="space-y-2">
        <span className="font-main text-sm font-semibold text-foreground">Status</span>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange("status", value as RoomBookingDraft["status"])}
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {roomBookingStatusOptions.map((status) => (
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
          value={formData.paymentStatus}
          onValueChange={(value) =>
            handleChange("paymentStatus", value as RoomBookingDraft["paymentStatus"])
          }
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            {roomBookingPaymentStatusOptions.map((status) => (
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
          value={formData.cancellationReason}
          onChange={(event) => handleChange("cancellationReason", event.target.value)}
          placeholder="If cancelled, why?"
          className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
        />
      </label>
    </div>
  );
}
