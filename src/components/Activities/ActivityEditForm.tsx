"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityCategoryOptions,
  activityIconOptions,
  activityPricingTypeOptions,
  type Activity,
  type ActivityStat,
} from "./data";

interface ActivityEditFormProps {
  activity: Activity;
  onChange: (activity: Activity) => void;
}

const formatPricingTypeLabel = (value: Activity["pricingType"]) =>
  value === "per_group" ? "Per Group" : "Per Person";

export default function ActivityEditForm({
  activity,
  onChange,
}: ActivityEditFormProps) {
  const [formData, setFormData] = useState<Activity>(activity);

  useEffect(() => {
    setFormData(activity);
  }, [activity]);

  const handleChange = <K extends keyof Activity>(key: K, value: Activity[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleNumberChange = <K extends keyof Activity>(key: K, value: string) => {
    const parsed = Number(value);
    handleChange(key, (Number.isNaN(parsed) ? 0 : parsed) as Activity[K]);
  };

  const handleStatChange = (index: number, key: keyof ActivityStat, value: string) => {
    const updatedStats = formData.stats.map((stat, statIndex) =>
      statIndex === index ? { ...stat, [key]: value } : stat
    );
    handleChange("stats", updatedStats);
  };

  const handleAddStat = () => {
    handleChange("stats", [...formData.stats, { value: "", label: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    handleChange(
      "stats",
      formData.stats.filter((_, statIndex) => statIndex !== index)
    );
  };

  const handleHighlightChange = (index: number, value: string) => {
    const updatedHighlights = formData.highlights.map((highlight, highlightIndex) =>
      highlightIndex === index ? value : highlight
    );
    handleChange("highlights", updatedHighlights);
  };

  const handleAddHighlight = () => {
    handleChange("highlights", [...formData.highlights, ""]);
  };

  const handleRemoveHighlight = (index: number) => {
    handleChange(
      "highlights",
      formData.highlights.filter((_, highlightIndex) => highlightIndex !== index)
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const updated: Activity = {
      ...formData,
      image: previewUrl,
      imageFile: file,
    };

    setFormData(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Activity Image</span>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-[24px] border border-border bg-muted/35">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.title || "Activity preview"}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="font-main flex h-48 items-center justify-center text-sm text-muted-foreground">
                  Upload an activity image to preview it here.
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="font-main block w-full cursor-pointer rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground file:mr-4 file:cursor-pointer file:rounded-full file:border-2 file:border-primary file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition-all file:duration-[600ms] hover:file:bg-secondary"
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Title</span>
          <input
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Label</span>
          <input
            value={formData.label}
            onChange={(event) => handleChange("label", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Category</span>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value as Activity["category"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {activityCategoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">icon</span>
          <Select
            value={formData.icon}
            onValueChange={(value) => handleChange("icon", value as Activity["icon"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {activityIconOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Location</span>
          <input
            value={formData.location}
            onChange={(event) => handleChange("location", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Base Price</span>
          <input
            type="number"
            min="0"
            value={formData.basePrice}
            onChange={(event) => handleNumberChange("basePrice", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Pricing Type</span>
          <Select
            value={formData.pricingType}
            onValueChange={(value) => handleChange("pricingType", value as Activity["pricingType"])}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select pricing type" />
            </SelectTrigger>
            <SelectContent>
              {activityPricingTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {formatPricingTypeLabel(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Duration (minutes)</span>
          <input
            type="number"
            min="15"
            step="15"
            value={formData.durationMinutes}
            onChange={(event) => handleNumberChange("durationMinutes", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Default Capacity</span>
          <input
            type="number"
            min="1"
            value={formData.defaultCapacity}
            onChange={(event) => handleNumberChange("defaultCapacity", event.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-3 rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Visibility</span>
          <button
            type="button"
            onClick={() => handleChange("isActive", !formData.isActive)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              formData.isActive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="font-main font-semibold">
              {formData.isActive ? "Visible for booking" : "Hidden from booking"}
            </span>
            <span className="font-main text-xs uppercase tracking-[0.2em]">
              {formData.isActive ? "Active" : "Hidden"}
            </span>
          </button>
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-main text-sm font-semibold text-foreground">Highlights</span>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Add highlight"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {formData.highlights.map((highlight, index) => (
              <div
                key={`highlight-${index}`}
                className="grid gap-3 rounded-[24px] border border-border bg-muted/35 p-3 sm:grid-cols-[1fr_auto]"
              >
                <input
                  value={highlight}
                  onChange={(event) => handleHighlightChange(index, event.target.value)}
                  placeholder="Highlight"
                  className="font-main w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-2xl border border-red-200/70 text-red-600 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
                  aria-label="Remove highlight"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {formData.highlights.length === 0 ? (
              <div className="font-main rounded-[24px] border border-dashed border-border bg-muted/35 px-4 py-5 text-sm text-muted-foreground">
                No highlights added yet.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-main text-sm font-semibold text-foreground">Stats</span>
            <button
              type="button"
              onClick={handleAddStat}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Add stat"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {formData.stats.map((stat, index) => (
              <div
                key={`stat-${index}`}
                className="grid gap-3 rounded-[24px] border border-border bg-muted/35 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={stat.value}
                  onChange={(event) => handleStatChange(index, "value", event.target.value)}
                  placeholder="Value"
                  className="font-main w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                />
                <input
                  value={stat.label}
                  onChange={(event) => handleStatChange(index, "label", event.target.value)}
                  placeholder="Label"
                  className="font-main w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStat(index)}
                  className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-2xl border border-red-200/70 text-red-600 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
                  aria-label="Remove stat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {formData.stats.length === 0 ? (
              <div className="font-main rounded-[24px] border border-dashed border-border bg-muted/35 px-4 py-5 text-sm text-muted-foreground">
                No stats added yet.
              </div>
            ) : null}
          </div>
        </div>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={5}
            className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>
      </div>
    </div>
  );
}
