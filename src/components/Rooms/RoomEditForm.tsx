"use client";

import type { RoomDraft } from "./data";
import RoomForm from "./RoomForm";

interface RoomEditFormProps {
  draft: RoomDraft;
  onChange: (draft: RoomDraft) => void;
}

export default function RoomEditForm({ draft, onChange }: RoomEditFormProps) {
  return <RoomForm draft={draft} onChange={onChange} />;
}
