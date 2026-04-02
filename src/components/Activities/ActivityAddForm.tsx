"use client";

import type { Activity } from "./data";
import ActivityEditForm from "./ActivityEditForm";

interface ActivityAddFormProps {
  activity: Activity;
  onChange: (activity: Activity) => void;
}

export default function ActivityAddForm({
  activity,
  onChange,
}: ActivityAddFormProps) {
  return <ActivityEditForm activity={activity} onChange={onChange} />;
}
