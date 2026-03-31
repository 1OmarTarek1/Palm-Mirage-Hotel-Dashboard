import { createTablePreset } from "./utils";
import { Facility } from "@/types/facility";
import { facilityCategoryOptions, facilityStatusOptions } from "@/components/Facilities/data";

export const facilityPreset = createTablePreset<Facility>(
  [
    {
      key: "name",
      title: "Facility",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "image", iconKey: "icon", subtitleKey: "category" }
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
      key: "location",
      title: "Location",
      sortable: true,
      searchable: true,
      type: "text"
    },
    {
      key: "capacity",
      title: "Capacity",
      sortable: true,
      type: "text"
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      filterable: true,
      type: "badge"
    },
    {
      key: "operatingHours",
      title: "Hours",
      sortable: true,
      type: "text",
      accessorKey: "operatingHours"
    }
  ],
  [
    {
      key: "category",
      label: "Category",
      type: "select",
      options: facilityCategoryOptions.map(cat => ({ label: cat, value: cat })),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: facilityStatusOptions.map(status => ({ label: status, value: status })),
    }
  ]
);

export const { columns: facilityColumns, filters: facilityFilters } = facilityPreset;
