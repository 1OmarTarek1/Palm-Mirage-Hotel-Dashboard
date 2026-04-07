"use client";

import type { RoomDraft } from "./data";
import RoomForm from "./RoomForm";

interface RoomAddFormProps {
  draft: RoomDraft;
  onChange: (draft: RoomDraft) => void;
}

export default function RoomAddForm({ draft, onChange }: RoomAddFormProps) {
  return <RoomForm draft={draft} onChange={onChange} />;
}
