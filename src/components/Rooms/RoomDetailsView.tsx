"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import type { Room } from "./data";
import { X, Check, Copy } from "lucide-react";

interface RoomDetailsViewProps {
  room: Room;
}

export default function RoomDetailsView({ room }: RoomDetailsViewProps) {
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      toast.success("Room ID copied.");
    } catch {
      toast.error("Failed to copy Room ID.");
    }
  };

  const mainImage = room.roomImages?.[0]?.secure_url || "";

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
        <div className="relative h-64 w-full md:h-80">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={room.roomName}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground bg-muted/50">
              No image available
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
                Room {room.roomNumber} • {room.roomType}
              </p>
              <h3 className="font-header mt-2 text-2xl font-bold text-foreground">{room.roomName}</h3>
            </div>
            <div className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              room.isAvailable 
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}>
              {room.isAvailable ? <Check size={14} /> : <X size={14} />}
              {room.isAvailable ? "Available" : "Hidden"}
            </div>
          </div>

          <p className="font-main text-sm leading-7 text-muted-foreground">{room.description}</p>

          <div>
            <h4 className="font-header text-sm font-semibold text-foreground">Facilities</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.facilities && room.facilities.length > 0 ? (
                room.facilities.map((f: any) => {
                  const facilityId = typeof f === "object" ? f._id : f;
                  const facilityName = typeof f === "object" ? f.name : "Facility";
                  return (
                    <span
                      key={facilityId || Math.random().toString()}
                      className="font-main rounded-xl border border-border bg-muted/35 px-3 py-1.5 text-xs font-semibold text-foreground flex items-center gap-2"
                    >
                      {facilityName}
                    </span>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground italic">No facilities specified.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[28px] border border-border bg-muted/35 p-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Base Price</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">${room.price}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Final Price</p>
            <p className="font-main mt-1 text-sm font-semibold text-primary font-bold">${room.finalPrice}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Discount</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{room.discount}% OFF</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{room.capacity} Guests</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Floor</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{room.floor}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Rating</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{room.rating} / 5 ({room.reviewsCount} reviews)</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Check-in</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">After {room.checkInTime}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Check-out</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">Before {room.checkOutTime}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3 overflow-hidden">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Room ID</p>
            <button
              onClick={handleCopyId}
              className="font-main mt-1 flex w-full items-center gap-2 truncate text-left text-[10px] font-semibold text-foreground transition hover:text-primary"
            >
              <Copy size={12} />
              {room.id}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
