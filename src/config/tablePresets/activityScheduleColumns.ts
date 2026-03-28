import { createTablePreset } from "./utils";
import { ActivitySchedule } from "@/components/ActivitySchedules/data";

export const activitySchedulePreset = createTablePreset<ActivitySchedule>(
  [
    {
      key: "activityTitle",
      title: "Activity",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "activityImage", subtitleKey: "activityLabel" },
    },
    {
      key: "date",
      title: "Date",
      sortable: true,
      searchable: true,
      type: "date",
      accessorType: "date",
    },
    {
      key: "startTime",
      title: "Start",
      sortable: true,
      type: "text",
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      type: "text",
    },
    {
      key: "availableSeats",
      title: "Available",
      sortable: true,
      type: "text",
    },
    {
      key: "resolvedPrice",
      title: "Price",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      searchable: true,
      filterable: true,
      type: "badge",
    },
  ],
  [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Scheduled", value: "scheduled" },
        { label: "Full", value: "full" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Completed", value: "completed" },
      ],
    },
  ]
);

export const {
  columns: activityScheduleColumns,
  filters: activityScheduleFilters,
} = activitySchedulePreset;
