import { createTablePreset } from "./utils";
import { Activity } from "@/components/Activities/data";

export const activityPreset = createTablePreset<Activity>(
  [ // columns
    {
      key: "title",
      title: "Activity",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "image", subtitleKey: "label" }
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      searchable: true,
      filterable: true,
      type: "badge"
    },
    {
      key: "basePrice",
      title: "Base Price",
      sortable: true,
      searchable: true,
      type: "text"
    },
    {
      key: "isActive",
      title: "Status",
      sortable: true,
      searchable: true,
      filterable: true,
      type: "badge"
    },
    {
      key: "createdAt",
      title: "Created At",
      sortable: true,
      type: "date",
      accessorType: "date"
    },
  ],
  [ // filters
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Nile trips", value: "nile" },
        { label: "Heritage", value: "heritage" },
        { label: "Desert", value: "desert" },
        { label: "Cultural", value: "cultural" },
        { label: "Balloon", value: "balloon" },
        { label: "Culinary", value: "culinary" },
      ],
    },
    {
      key: "isActive",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "true" },
        { label: "Hidden", value: "false" },
      ],
    },
  ]
);

export const { columns: activityColumns, filters: activityFilters } = activityPreset;
