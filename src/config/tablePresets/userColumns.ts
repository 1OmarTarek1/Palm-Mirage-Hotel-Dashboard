import { createTablePreset } from "./utils";
import type { User } from "@/components/UserDashboard/data";

export const userPreset = createTablePreset<User>(
  [
    {
      key: "userName",
      title: "User",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "image", subtitleKey: "email" },
    },
    {
      key: "role",
      title: "Role",
      sortable: true,
      searchable: true,
      filterable: true,
      type: "badge",
    },
    {
      key: "country",
      title: "Country",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "gender",
      title: "Gender",
      sortable: true,
      filterable: true,
      type: "badge",
    },
    {
      key: "isConfirmed",
      title: "Status",
      sortable: true,
      filterable: true,
      type: "badge",
    },
  ],
  [
    {
      key: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
  ]
);

export const { columns: userColumns, filters: userFilters } = userPreset;
