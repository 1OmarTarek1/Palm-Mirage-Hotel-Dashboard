"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  activityCategoryOptions,
  activityIconOptions,
  type Activity,
  type ActivityStat,
} from "./data";

interface ActivityEditFormProps {
  activity: Activity;
  onChange: (activity: Activity) => void;
}

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
          <span className="text-sm font-semibold text-slate-700">Activity Image</span>
          <div className="space-y-3">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              <img
                src={formData.image}
                alt={formData.title}
                className="h-48 w-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Title</span>
          <input
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Label</span>
          <input
            value={formData.label}
            onChange={(event) => handleChange("label", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <select
            value={formData.category}
            onChange={(event) => handleChange("category", event.target.value as Activity["category"])}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
          >
            {activityCategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Icon</span>
          <select
            value={formData.icon}
            onChange={(event) => handleChange("icon", event.target.value as Activity["icon"])}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
          >
            {activityIconOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Highlights</span>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Add Highlight
            </button>
          </div>

          <div className="space-y-3">
            {formData.highlights.map((highlight, index) => (
              <div
                key={`${index}-${highlight}`}
                className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto]"
              >
                <input
                  value={highlight}
                  onChange={(event) => handleHighlightChange(index, event.target.value)}
                  placeholder="Highlight"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(index)}
                  className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-2xl border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Remove highlight"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {formData.highlights.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No highlights added yet.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Stats</span>
            <button
              type="button"
              onClick={handleAddStat}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {formData.stats.map((stat, index) => (
              <div
                key={`${index}-${stat.label}`}
                className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={stat.value}
                  onChange={(event) => handleStatChange(index, "value", event.target.value)}
                  placeholder="Value"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                />
                <input
                  value={stat.label}
                  onChange={(event) => handleStatChange(index, "label", event.target.value)}
                  placeholder="Label"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveStat(index)}
                  className="flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-2xl border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Remove stat"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {formData.stats.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                No stats added yet.
              </div>
            ) : null}
          </div>
        </div>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => handleChange("description", event.target.value)}
            rows={5}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
}
