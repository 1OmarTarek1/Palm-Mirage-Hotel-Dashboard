import type { RestaurantTable } from "@/components/Restaurant/data";

import { createTablePreset } from "./utils";

export const restaurantTablePreset = createTablePreset<RestaurantTable>(
  [
    {
      key: "number",
      title: "Table No.",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "chairs",
      title: "Seats",
      sortable: true,
      filterable: true,
      type: "count",
    },
    {
      key: "createdAt",
      title: "Created",
      sortable: true,
      type: "date",
      accessorType: "date",
    },
    {
      key: "updatedAt",
      title: "Updated",
      sortable: true,
      type: "date",
      accessorType: "date",
    },
  ],
  [
    {
      key: "chairs",
      label: "Seats",
      type: "range",
    },
  ]
);

export const { columns: restaurantTableColumns, filters: restaurantTableFilters } =
  restaurantTablePreset;
