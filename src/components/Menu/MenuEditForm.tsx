"use client";

import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  menuCategoryOptions,
  menuIconOptions,
  type MenuItem,
  type MenuIcon,
} from "./data";

interface MenuEditFormProps {
  item: MenuItem;
  onChange: (item: MenuItem) => void;
}

export default function MenuEditForm({
  item,
  onChange,
}: MenuEditFormProps) {
  const [formData, setFormData] = useState<MenuItem>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = <K extends keyof MenuItem>(key: K, value: MenuItem[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleNumberChange = <K extends keyof MenuItem>(key: K, value: string) => {
    const parsed = Number(value);
    handleChange(key, (Number.isNaN(parsed) ? 0 : parsed) as MenuItem[K]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: "image" | "categoryHeroImg") => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const updated: MenuItem = {
      ...formData,
      [type]: previewUrl,
      [`${type}File`]: file,
    };

    setFormData(updated);
    onChange(updated);
  };

  const renderIcon = (iconName: MenuIcon) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent size={16} /> : null;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Product Image */}
        <div className="space-y-4">
          <span className="text-sm font-semibold text-foreground">Product Image</span>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
            {formData.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formData.image}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No image selected
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "image")}
            className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary/90"
          />
        </div>

        {/* Category Hero Image */}
        <div className="space-y-4">
          <span className="text-sm font-semibold text-foreground">Category Hero Image</span>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
            {formData.categoryHeroImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formData.categoryHeroImg}
                alt="Hero Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                No hero image selected
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "categoryHeroImg")}
            className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-primary/90"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Name</label>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Item name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category</label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value as any)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-muted/30">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {menuCategoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category Icon</label>
          <Select
            value={formData.categoryIcon}
            onValueChange={(value) => handleChange("categoryIcon", value as any)}
          >
            <SelectTrigger className="h-11 rounded-xl bg-muted/30">
              <SelectValue placeholder="Select icon" />
            </SelectTrigger>
            <SelectContent>
              {menuIconOptions.map((iconName) => (
                <SelectItem key={iconName} value={iconName}>
                  <div className="flex items-center gap-2">
                    {renderIcon(iconName)}
                    <span>{iconName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Visibility / Availability</label>
          <button
            type="button"
            onClick={() => handleChange("available", !formData.available)}
            className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
              formData.available
                ? "border-primary/20 bg-primary/5 text-primary"
                : "border-border bg-muted/20 text-muted-foreground"
            }`}
          >
            <span className="font-semibold">{formData.available ? "Currently Available" : "Sold Out / Hidden"}</span>
            <div className={`h-2 w-2 rounded-full ${formData.available ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
          </button>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Describe the item..."
          />
        </div>
      </div>
    </div>
  );
}
