import { createTablePreset } from "./utils";
import type { RoomAmenity } from "@/types/room-amenity";

export const roomAmenityPreset = createTablePreset<RoomAmenity>(
  [
    {
      key: "name",
      title: "Amenity",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { iconKey: "icon", subtitleKey: "description" },
    },
    {
      key: "updatedAt",
      title: "Updated",
      sortable: true,
      type: "date",
    },
  ],
  []
);

export const { columns: roomAmenityColumns, filters: roomAmenityFilters } = roomAmenityPreset;
