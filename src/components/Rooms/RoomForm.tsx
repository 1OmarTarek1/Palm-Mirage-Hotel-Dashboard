"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoomDraft, RoomType } from "./data";
import { fetchFacilities, type Facility } from "@/lib/facilities";
import Image from "next/image";

interface RoomFormProps {
  draft: RoomDraft;
  onChange: (draft: RoomDraft) => void;
}

const roomTypeOptions: { label: string; value: RoomType }[] = [
  { label: "Single", value: "single" },
  { label: "Double", value: "double" },
  { label: "Twin", value: "twin" },
  { label: "Deluxe", value: "deluxe" },
  { label: "Family", value: "family" },
];

export default function RoomForm({ draft, onChange }: RoomFormProps) {
  const [formData, setFormData] = useState<RoomDraft>(draft);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    setFormData(draft);
  }, [draft]);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await fetchFacilities();
        setAllFacilities(data);
      } catch (error) {
        console.error("Failed to load facilities:", error);
      }
    };
    void loadFacilities();
  }, []);

  const handleChange = <K extends keyof RoomDraft>(key: K, value: RoomDraft[K]) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleNumberChange = <K extends keyof RoomDraft>(key: K, value: string) => {
    const parsed = Number(value);
    handleChange(key, (Number.isNaN(parsed) ? 0 : parsed) as RoomDraft[K]);
  };

  const handleFacilityToggle = (facilityId: string) => {
    const current = formData.facilities || [];
    const updated = current.includes(facilityId)
      ? current.filter((id) => id !== facilityId)
      : [...current, facilityId];
    handleChange("facilities", updated);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const updatedFiles = [...(formData.imageFiles || []), ...newFiles];
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    handleChange("imageFiles", updatedFiles);
  };

  const removeImageFile = (index: number) => {
    const updatedFiles = (formData.imageFiles || []).filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImagePreviews(updatedPreviews);
    handleChange("imageFiles", updatedFiles);
  };

  const removeExistingImage = (publicId: string) => {
    const updatedImages = formData.roomImages.filter(img => img.public_id !== publicId);
    handleChange("roomImages", updatedImages);
    // Note: Backend handle deletedImages array in some implementation, 
    // but here we just update the roomImages object.
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Images</span>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {/* Existing Images */}
              {formData.roomImages?.filter(Boolean).map((img) => (
                <div key={img.public_id || Math.random().toString()} className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                  {img.secure_url && (
                    <Image src={img.secure_url} alt="Room" fill className="object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => img.public_id && removeExistingImage(img.public_id)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {/* New Images Previews */}
              {imagePreviews.map((url, index) => (
                <div key={`new-${index}`} className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
                  <Image src={url} alt="New Room" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImageFile(index)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/35 hover:bg-muted/50 transition">
                <Plus size={24} className="text-muted-foreground" />
                <span className="font-main mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Add</span>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="hidden" />
              </label>
            </div>
          </div>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Name</span>
          <input
            value={formData.roomName}
            onChange={(e) => handleChange("roomName", e.target.value)}
            placeholder="e.g. Presidential Suite"
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Number</span>
          <input
            type="number"
            value={formData.roomNumber}
            onChange={(e) => handleNumberChange("roomNumber", e.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Type</span>
          <Select
            value={formData.roomType}
            onValueChange={(value) => handleChange("roomType", value as RoomType)}
          >
            <SelectTrigger className="h-[50px] rounded-2xl bg-muted/35">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Floor</span>
          <input
            type="number"
            value={formData.floor}
            onChange={(e) => handleNumberChange("floor", e.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Base Price</span>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Discount (%)</span>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => handleNumberChange("discount", e.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2 text-primary font-semibold">
           <span className="font-main text-sm text-foreground">Capacity</span>
           <input
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => handleNumberChange("capacity", e.target.value)}
            className="font-main w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>

        <div className="space-y-3 rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-1">
          <span className="font-main text-sm font-semibold text-foreground">Visibility</span>
          <button
            type="button"
            onClick={() => handleChange("isAvailable", !formData.isAvailable)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              formData.isAvailable
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="font-main font-semibold">
              {formData.isAvailable ? "Available" : "Hidden"}
            </span>
          </button>
        </div>

        <div className="space-y-3 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Facilities</span>
          <div className="flex flex-wrap gap-2">
            {allFacilities.map((f) => (
              <button
                key={f._id}
                type="button"
                onClick={() => handleFacilityToggle(f._id)}
                className={`font-main rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  formData.facilities?.includes(f._id)
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-border bg-muted/35 text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-card"
          />
        </label>
      </div>
    </div>
  );
}
