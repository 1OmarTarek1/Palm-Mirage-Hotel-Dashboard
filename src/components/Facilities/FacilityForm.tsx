"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facility } from "@/types/facility";
import { facilityCategoryOptions, facilityStatusOptions, facilityIconOptions } from "./data";

interface FacilityFormProps {
  facility: Facility;
  onChange: (facility: Facility) => void;
}

export default function FacilityForm({ facility, onChange }: FacilityFormProps) {
  const [formData, setFormData] = useState<Facility>(facility);

  useEffect(() => {
    setFormData(facility);
  }, [facility]);

  const handleChange = <K extends keyof Facility>(key: K, value: Facility[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Name */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Facility Name</span>
          <input
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="e.g. Fitness Center"
          />
        </label>

        {/* Category */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Category</span>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35 border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {facilityCategoryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* Status */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Status</span>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as Facility["status"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35 border-border">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {facilityStatusOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* Icon */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Icon</span>
          <Select
            value={formData.icon}
            onValueChange={(value) => handleChange("icon", value)}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35 border-border">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {facilityIconOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {/* Location */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Location</span>
          <input
            value={formData.location}
            onChange={(event) => handleChange("location", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="e.g. Ground Floor, East Wing"
          />
        </label>

        {/* Capacity */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Capacity (Optional)</span>
          <input
            type="number"
            value={formData.capacity || ""}
            onChange={(event) => handleChange("capacity", parseInt(event.target.value) || 0)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="e.g. 50"
          />
        </label>

        {/* Operating Hours */}
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Operating Hours</span>
          <input
            value={formData.operatingHours}
            onChange={(event) => handleChange("operatingHours", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
            placeholder="e.g. 06:00 - 22:00"
          />
        </label>

        {/* Description */}
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={3}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card resize-none"
            placeholder="Enter facility description..."
          />
        </label>
      </div>
    </div>
  );
}
