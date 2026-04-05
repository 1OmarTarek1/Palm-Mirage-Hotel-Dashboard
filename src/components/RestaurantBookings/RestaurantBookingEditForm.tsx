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
  restaurantBookingPaymentStatusOptions,
  restaurantBookingStatusOptions,
  type RestaurantBookingDraft,
} from "./data";

interface RestaurantBookingEditFormProps {
  booking: RestaurantBookingDraft;
  onChange: (booking: RestaurantBookingDraft) => void;
}

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function RestaurantBookingEditForm({
  booking,
  onChange,
}: RestaurantBookingEditFormProps) {
  const [formData, setFormData] = useState<RestaurantBookingDraft>(booking);

  useEffect(() => {
    setFormData(booking);
  }, [booking]);

  const handleStatus = (status: RestaurantBookingDraft["status"]) => {
    const updated = { ...formData, status };
    setFormData(updated);
    onChange(updated);
  };

  const handlePaymentStatus = (paymentStatus: NonNullable<RestaurantBookingDraft["paymentStatus"]>) => {
    const updated = { ...formData, paymentStatus };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <label className="space-y-2">
        <span className="font-main text-sm font-semibold text-foreground">Status</span>
        <Select
          value={formData.status}
          onValueChange={(value) => handleStatus(value as RestaurantBookingDraft["status"])}
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {restaurantBookingStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {formatLabel(status.replace(/_/g, " "))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <label className="space-y-2">
        <span className="font-main text-sm font-semibold text-foreground">Payment status</span>
        <Select
          value={formData.paymentStatus ?? "unpaid"}
          onValueChange={(value) =>
            handlePaymentStatus(value as NonNullable<RestaurantBookingDraft["paymentStatus"]>)
          }
        >
          <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            {restaurantBookingPaymentStatusOptions.map((ps) => (
              <SelectItem key={ps} value={ps}>
                {formatLabel(ps)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    </div>
  );
}
