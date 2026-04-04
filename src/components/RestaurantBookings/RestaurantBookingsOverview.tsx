import { Clock3, LayoutGrid, ReceiptText, Users } from "lucide-react";

import TableOverview from "@/components/shared/table/TableOverview";

interface RestaurantBookingsOverviewProps {
  totalBookings: number;
  pendingBookings: number;
  assignedTables: number;
  totalGuests: number;
  isLoading?: boolean;
}

export default function RestaurantBookingsOverview(props: RestaurantBookingsOverviewProps) {
  return (
    <TableOverview
      isLoading={props.isLoading}
      items={[
        {
          key: "total",
          label: "Bookings listed",
          value: props.totalBookings,
          helper: "Restaurant reservations visible in this board",
          icon: ReceiptText,
        },
        {
          key: "pending",
          label: "Pending waitlist",
          value: props.pendingBookings,
          helper: "Requests still waiting for assignment or confirmation",
          icon: Clock3,
          tone: props.pendingBookings > 0 ? "destructive" : "secondary",
        },
        {
          key: "tables",
          label: "Assigned tables",
          value: props.assignedTables,
          helper: "Bookings already linked to a table number",
          icon: LayoutGrid,
          tone: "secondary",
        },
        {
          key: "guests",
          label: "Expected guests",
          value: props.totalGuests,
          helper: "Combined covers across the listed bookings",
          icon: Users,
        },
      ]}
    />
  );
}
