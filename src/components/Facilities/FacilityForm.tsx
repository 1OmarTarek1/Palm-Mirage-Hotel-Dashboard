"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facility } from "@/types/facility";
import { facilityCategoryOptions, facilityStatusOptions, facilityIconOptions } from "./data";
import { DynamicIcon } from "@/components/shared/utils/icons";

interface FacilityFormProps {
  facility: Facility;
  onChange: (facility: Facility) => void;
  usedIcons?: string[];
}

export default function FacilityForm({ facility, onChange, usedIcons = [] }: FacilityFormProps) {
  const handleChange = <K extends keyof Facility>(key: K, value: Facility[K]) => {
    const updated = { ...facility, [key]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Name */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Facility Name</span>
          <input
            value={facility.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
            placeholder="e.g. Fitness Center"
          />
        </label>

        {/* Category */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Category</span>
          <Select
            value={facility.category}
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
            value={facility.status}
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
          <div className="flex items-center gap-3">
            {facility.icon && (
              <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl border border-border bg-primary/5 text-primary">
                <DynamicIcon name={facility.icon} size={22} />
              </div>
            )}
            <Select
              value={facility.icon}
              onValueChange={(value) => handleChange("icon", value)}
            >
              <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35 border-border">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                {facilityIconOptions
                  .filter((opt) => opt === facility.icon || !usedIcons.includes(opt))
                  .map((opt) => (
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

        {/* Location */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Location</span>
          <input
            value={facility.location}
            onChange={(event) => handleChange("location", event.target.value)}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
            placeholder="e.g. Ground Floor, East Wing"
          />
        </label>

        {/* Capacity */}
        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Capacity (Optional)</span>
          <input
            type="number"
            min="1"
            value={facility.capacity || ""}
            onChange={(event) => handleChange("capacity", parseInt(event.target.value) || 0)}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
            placeholder="e.g. 50"
          />
        </label>

        {/* Operating Hours */}
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Operating Hours</span>
          <input
            value={facility.operatingHours}
            onChange={(event) => handleChange("operatingHours", event.target.value)}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
            placeholder="e.g. 06:00 - 22:00"
          />
        </label>

        {/* Description */}
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={facility.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={3}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card resize-none"
            placeholder="Enter facility description..."
          />
        </label>
      </div>
    </div>
  );
}
