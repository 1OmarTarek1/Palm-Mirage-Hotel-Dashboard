import { createTablePreset } from "./utils";
import { Room } from "@/components/Rooms/data";

export const roomPreset = createTablePreset<Room>(
  [
    {
      key: "roomName",
      title: "Room",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "image", subtitleKey: "roomType" },
    },
    {
      key: "roomNumber",
      title: "No.",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      type: "count",
    },
    {
      key: "isAvailable",
      title: "Available",
      sortable: true,
      filterable: true,
      type: "badge",
    },
    {
      key: "createdAt",
      title: "Added On",
      sortable: true,
      type: "date",
      accessorType: "date",
    },
  ],
  [
    {
      key: "roomType",
      label: "Type",
      type: "select",
      options: [
        { label: "Single", value: "single" },
        { label: "Double", value: "double" },
        { label: "Twin", value: "twin" },
        { label: "Deluxe", value: "deluxe" },
        { label: "Family", value: "family" },
      ],
    },
    {
      key: "isAvailable",
      label: "Availability",
      type: "select",
      options: [
        { label: "Available", value: "true" },
        { label: "Booked/Hidden", value: "false" },
      ],
    },
  ]
);

export const { columns: roomColumns, filters: roomFilters } = roomPreset;
