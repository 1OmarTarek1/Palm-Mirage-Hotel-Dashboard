"use client";

import type { Room } from "./data";
import { AlertTriangle } from "lucide-react";

interface RoomDeleteConfirmProps {
  room: Room;
}

export default function RoomDeleteConfirm({ room }: RoomDeleteConfirmProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
        <AlertTriangle size={40} />
      </div>

      <div className="text-center">
        <h3 className="font-header text-xl font-bold text-foreground">Delete Room {room.roomNumber}?</h3>
        <p className="font-main mt-3 text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete <span className="font-bold text-foreground">{room.roomName}</span>? 
          This action cannot be undone and will remove all associated room data.
        </p>
      </div>

      <div className="w-full rounded-2xl bg-muted/35 p-4 text-center">
        <p className="font-main text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room ID</p>
        <p className="font-main mt-1 text-sm font-bold text-foreground truncate">{room.id}</p>
      </div>
    </div>
  );
}
