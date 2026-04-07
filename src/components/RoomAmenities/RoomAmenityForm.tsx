"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DynamicIcon } from "@/components/shared/utils/icons";
import type { RoomAmenity } from "@/types/room-amenity";
import { roomAmenityIconOptions } from "./data";

interface RoomAmenityFormProps {
  amenity: RoomAmenity;
  onChange: (amenity: RoomAmenity) => void;
}

export default function RoomAmenityForm({ amenity, onChange }: RoomAmenityFormProps) {
  const [formData, setFormData] = useState<RoomAmenity>(amenity);

  useEffect(() => {
    setFormData(amenity);
  }, [amenity]);

  const handleChange = <K extends keyof RoomAmenity>(key: K, value: RoomAmenity[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Amenity Name</span>
          <input
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="e.g. Air Conditioning"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Icon</span>
          <div className="flex items-center gap-3">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/5 text-primary">
              <DynamicIcon name={formData.icon || "Wifi"} size={22} />
            </div>
            <Select
              value={formData.icon || "Wifi"}
              onValueChange={(value) => handleChange("icon", value)}
            >
              <SelectTrigger className="h-[50px] rounded-2xl border-border bg-muted/35">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {roomAmenityIconOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    <span className="flex items-center gap-2">
                      <DynamicIcon name={opt} size={15} />
                      {opt}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={3}
            className="font-main w-full resize-none rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="Optional note for this amenity..."
          />
        </label>
      </div>
    </div>
  );
}
