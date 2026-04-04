"use client";

import type { RoomBooking } from "./data";
import { User, Calendar, Moon, Users, CreditCard, MessageSquare, Clock } from "lucide-react";
import Image from "next/image";

interface RoomBookingDetailsViewProps {
  booking: RoomBooking;
}

export default function RoomBookingDetailsView({ booking }: RoomBookingDetailsViewProps) {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
        <div className="relative h-64 w-full md:h-72">
          {booking.roomImage ? (
            <Image
              src={booking.roomImage}
              alt={booking.roomName}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/50 text-muted-foreground">
              No room image available
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-border bg-muted/35 p-6">
        <div className="flex flex-col gap-1">
          <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Room {booking.roomNumber} • {booking.roomType}
          </p>
          <h3 className="font-header text-2xl font-bold text-foreground">{booking.roomName}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
              booking.status === "completed" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
              booking.status === "cancelled" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              "bg-blue-500/10 text-blue-500 border border-blue-500/20"
            }`}>
              {booking.status.replace("-", " ")}
            </span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
              booking.paymentStatus === "paid" ? "bg-green-500/10 text-green-500 border border-green-500/20" :
              "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
            }`}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-[28px] border border-border bg-card p-5">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <User size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Guest Information</p>
               <p className="font-main text-sm font-semibold text-foreground">{booking.userName}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <Calendar size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stay Dates</p>
               <p className="font-main text-sm font-semibold text-foreground">{booking.checkInDate} to {booking.checkOutDate}</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <Moon size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Duration</p>
               <p className="font-main text-sm font-semibold text-foreground">{booking.nights} Nights</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <Users size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Guests</p>
               <p className="font-main text-sm font-semibold text-foreground">{booking.guests} People</p>
             </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-border bg-card p-5">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <CreditCard size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Financials</p>
               <p className="font-main text-sm font-semibold text-foreground">Total: ${booking.totalPrice}</p>
               <p className="text-[10px] text-muted-foreground">${booking.pricePerNight} per night</p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <Clock size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment Method</p>
               <p className="font-main text-sm font-semibold text-foreground uppercase">{booking.paymentMethod || "Not specified"}</p>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
               <MessageSquare size={20} className="text-muted-foreground" />
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Special Requests</p>
               <p className="font-main text-sm text-foreground">{booking.specialRequests || "None"}</p>
             </div>
          </div>
        </div>
      </div>

      {booking.status === "cancelled" && booking.cancellationReason && (
        <div className="rounded-[28px] border border-red-200/50 bg-red-50/30 p-5">
           <p className="text-xs font-bold uppercase tracking-widest text-red-500">Cancellation Reason</p>
           <p className="font-main mt-2 text-sm text-foreground">{booking.cancellationReason}</p>
        </div>
      )}
    </div>
  );
}
