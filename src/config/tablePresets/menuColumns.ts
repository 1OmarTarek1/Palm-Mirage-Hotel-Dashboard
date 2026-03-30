import { createTablePreset } from "./utils";
import { MenuItem } from "@/components/Menu/data";

export const menuPreset = createTablePreset<MenuItem>(
  [ // columns
    {
      key: "name",
      title: "Product",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "image", subtitleKey: "category" }
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
      key: "price",
      title: "Price",
      sortable: true,
      searchable: true,
      type: "text",
      config: { prefix: "$" }
    },
    {
      key: "available",
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
        { label: "Appetizer", value: "Appetizer" },
        { label: "Restaurant", value: "Restaurant" },
        { label: "Desserts", value: "Desserts" },
        { label: "Drinks", value: "Drinks" },
      ],
    },
    {
      key: "available",
      label: "Status",
      type: "select",
      options: [
        { label: "Available", value: "true" },
        { label: "Not Available", value: "false" },
      ],
    },
  ]
);

export const { columns: menuColumns, filters: menuFilters } = menuPreset;
