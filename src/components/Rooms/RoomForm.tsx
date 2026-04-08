"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoomDraft, RoomType } from "./data";
import { fetchRoomAmenities } from "@/lib/room-amenities";
import type { RoomAmenity } from "@/types/room-amenity";
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
  const [allAmenities, setAllAmenities] = useState<RoomAmenity[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const data = await fetchRoomAmenities();
        setAllAmenities(data);
      } catch (error) {
        console.error("Failed to load room amenities:", error);
      }
    };
    void loadAmenities();
  }, []);

  const handleChange = <K extends keyof RoomDraft>(key: K, value: RoomDraft[K]) => {
    const updated = { ...draft, [key]: value };
    onChange(updated);
  };

  const handleNumberChange = <K extends keyof RoomDraft>(key: K, value: string) => {
    if (value === "") {
      handleChange(key, 0 as RoomDraft[K]);
      return;
    }
    
    const parsed = Number(value);
    handleChange(key, (Number.isNaN(parsed) ? 0 : parsed) as RoomDraft[K]);
  };

  const handleAmenityToggle = (amenityId: string) => {
    if (!amenityId || amenityId === "undefined") return;
    
    const current = draft.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    handleChange("amenities", updated);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const updatedFiles = [...(draft.imageFiles || []), ...newFiles];
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    handleChange("imageFiles", updatedFiles);
  };

  const removeImageFile = (index: number) => {
    const updatedFiles = (draft.imageFiles || []).filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImagePreviews(updatedPreviews);
    handleChange("imageFiles", updatedFiles);
  };

  const removeExistingImage = (publicId: string) => {
    const updatedImages = draft.roomImages.filter(img => img.public_id !== publicId);
    onChange({
      ...draft,
      roomImages: updatedImages,
      deletedImageIds: [...(draft.deletedImageIds || []), publicId],
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Images</span>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {/* Existing Images */}
              {draft.roomImages?.filter(Boolean).map((img) => (
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
            value={draft.roomName}
            onChange={(e) => handleChange("roomName", e.target.value)}
            placeholder="e.g. Presidential Suite"
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Number</span>
          <input
            type="number"
            min="1"
            value={draft.roomNumber || ""}
            onChange={(e) => handleNumberChange("roomNumber", e.target.value)}
            onFocus={(e) => e.target.select()}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Type</span>
          <Select
            value={draft.roomType}
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
            min="0"
            value={draft.floor || ""}
            onChange={(e) => handleNumberChange("floor", e.target.value)}
            onFocus={(e) => e.target.select()}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Base Price</span>
          <input
            type="number"
            min="0"
            value={draft.price || ""}
            onChange={(e) => handleNumberChange("price", e.target.value)}
            onFocus={(e) => e.target.select()}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2">
          <span className="font-main text-sm font-semibold text-foreground">Discount (%)</span>
          <input
            type="number"
            min="0"
            max="100"
            value={draft.discount === 0 ? "0" : draft.discount || ""}
            onChange={(e) => handleNumberChange("discount", e.target.value)}
            onFocus={(e) => e.target.select()}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <label className="space-y-2 text-primary font-semibold">
           <span className="font-main text-sm text-foreground">Capacity</span>
           <input
            type="number"
            min="1"
            value={draft.capacity || ""}
            onChange={(e) => handleNumberChange("capacity", e.target.value)}
            onFocus={(e) => e.target.select()}
            className="font-main h-[50px] w-full rounded-2xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>

        <div className="space-y-3 rounded-[24px] border border-border bg-muted/35 p-4 md:col-span-1">
          <span className="font-main text-sm font-semibold text-foreground">Visibility</span>
          <button
            type="button"
            onClick={() => handleChange("isAvailable", !draft.isAvailable)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              draft.isAvailable
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <span className="font-main font-semibold">
              {draft.isAvailable ? "Available" : "Hidden"}
            </span>
          </button>
        </div>

        <div className="space-y-3 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Room Amenities</span>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity) => (
              <button
                key={amenity._id}
                type="button"
                onClick={() => handleAmenityToggle(amenity._id)}
                className={`font-main rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  draft.amenities?.includes(amenity._id)
                    ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                    : "border-border bg-muted/35 text-muted-foreground hover:bg-muted"
                }`}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>

        <label className="space-y-2 md:col-span-2">
          <span className="font-main text-sm font-semibold text-foreground">Description</span>
          <textarea
            value={draft.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="font-main w-full rounded-3xl border border-border bg-muted/35 px-4 py-3 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-150 focus:border-primary focus:bg-card"
          />
        </label>
      </div>
    </div>
  );
}
