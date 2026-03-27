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
      key: "icon",
      title: "Icon",
      type: "icon" // Uses IconCell internally inside CellRenderer mapping
    },
    {
      key: "highlights",
      title: "Highlights",
      type: "count",
      accessorType: "count",
      config: { suffix: "info" }
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
      key: "icon",
      label: "Icon",
      type: "select",
      options: [
        { label: "Ship", value: "Ship" },
        { label: "Landmark", value: "Landmark" },
        { label: "Mountain", value: "Mountain" },
        { label: "Palette", value: "Palette" },
        { label: "CloudSun", value: "CloudSun" },
        { label: "ChefHat", value: "ChefHat" },
      ],
    },
  ]
);

export const { columns: activityColumns, filters: activityFilters } = activityPreset;
