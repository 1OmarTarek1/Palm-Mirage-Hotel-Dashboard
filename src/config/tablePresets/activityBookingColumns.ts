import { createTablePreset } from "./utils";
import { ActivityBooking } from "@/components/ActivityBookings/data";

export const activityBookingPreset = createTablePreset<ActivityBooking>(
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
      key: "userName",
      title: "Guest",
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
      key: "totalPrice",
      title: "Total",
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
        { label: "Rejected", value: "rejected" },
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
  columns: activityBookingColumns,
  filters: activityBookingFilters,
} = activityBookingPreset;
