import type { RestaurantBooking } from "@/components/RestaurantBookings/data";

import { createTablePreset } from "./utils";

export const restaurantBookingPreset = createTablePreset<RestaurantBooking>(
  [
    {
      key: "userName",
      title: "Guest",
      sortable: true,
      searchable: true,
      type: "text",
      cellAlign: "left",
      headerAlign: "left",
    },
    {
      key: "tableNumber",
      title: "Table",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "guests",
      title: "Guests",
      sortable: true,
      type: "count",
    },
    {
      key: "bookingDate",
      title: "Date",
      sortable: true,
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
      key: "status",
      title: "Status",
      sortable: true,
      searchable: true,
      filterable: true,
      type: "badge",
    },
    {
      key: "paymentStatus",
      title: "Payment",
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
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      key: "paymentStatus",
      label: "Payment",
      type: "select",
      options: [
        { label: "Unpaid", value: "unpaid" },
        { label: "Paid", value: "paid" },
        { label: "Refunded", value: "refunded" },
      ],
    },
  ]
);

export const {
  columns: restaurantBookingColumns,
  filters: restaurantBookingFilters,
} = restaurantBookingPreset;
