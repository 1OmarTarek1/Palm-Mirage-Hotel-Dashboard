import { createTablePreset } from "./utils";
import { RoomBooking } from "@/components/RoomBookings/data";

export const roomBookingPreset = createTablePreset<RoomBooking>(
  [
    {
      key: "roomName",
      title: "Room",
      cellAlign: "left",
      headerAlign: "left",
      searchable: true,
      sortable: true,
      type: "image-card",
      config: { imageKey: "roomImage", subtitleKey: "roomType" },
    },
    {
      key: "userName",
      title: "Guest",
      sortable: true,
      searchable: true,
      type: "text",
    },
    {
      key: "checkInDate",
      title: "In",
      sortable: true,
      type: "date",
      accessorType: "date",
    },
    {
      key: "checkOutDate",
      title: "Out",
      sortable: true,
      type: "date",
      accessorType: "date",
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
      key: "totalPrice",
      title: "Total",
      sortable: true,
      type: "text",
    },
    {
      key: "paymentStatus",
      title: "Payment",
      sortable: true,
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
        { label: "Checked-in", value: "checked-in" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "No-show", value: "no-show" },
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

export const { columns: roomBookingColumns, filters: roomBookingFilters } = roomBookingPreset;
