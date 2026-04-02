"use client";

import ActivityScheduleEditForm from "./ActivityScheduleEditForm";
import type { ActivityOption, ActivityScheduleDraft } from "./data";

interface ActivityScheduleAddFormProps {
  schedule: ActivityScheduleDraft;
  activities: ActivityOption[];
  onChange: (schedule: ActivityScheduleDraft) => void;
}

export default function ActivityScheduleAddForm(props: ActivityScheduleAddFormProps) {
  return <ActivityScheduleEditForm {...props} />;
}
