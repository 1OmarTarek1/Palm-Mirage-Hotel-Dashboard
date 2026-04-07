"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import type { RestaurantTableDraft } from "./data";

interface RestaurantTableFormProps {
  draft: RestaurantTableDraft;
  onChange: (draft: RestaurantTableDraft) => void;
}

export default function RestaurantTableForm({
  draft,
  onChange,
}: RestaurantTableFormProps) {
  const [formData, setFormData] = useState<RestaurantTableDraft>(draft);

  useEffect(() => {
    setFormData(draft);
  }, [draft]);

  const handleChange = <K extends keyof RestaurantTableDraft>(
    key: K,
    value: RestaurantTableDraft[K]
  ) => {
    const next = { ...formData, [key]: value };
    setFormData(next);
    onChange(next);
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <label className="font-main text-sm font-medium text-foreground">Table Number</label>
        <Input
          type="number"
          min={1}
          value={formData.number}
          onChange={(event) => handleChange("number", Number(event.target.value))}
          className="h-11 rounded-xl bg-card px-4"
        />
      </div>

      <div className="space-y-2">
        <label className="font-main text-sm font-medium text-foreground">Seat Capacity</label>
        <Input
          type="number"
          min={1}
          value={formData.chairs}
          onChange={(event) => handleChange("chairs", Number(event.target.value))}
          className="h-11 rounded-xl bg-card px-4"
        />
      </div>
    </div>
  );
}
