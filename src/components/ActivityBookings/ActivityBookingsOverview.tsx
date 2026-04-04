import {
  CalendarClock,
  CircleDollarSign,
  Clock3,
  TicketCheck,
  TicketX,
  Users,
} from "lucide-react";

import TableOverview from "@/components/shared/table/TableOverview";

interface ActivityBookingsOverviewProps {
  sessionsToday: number;
  pendingBookings: number;
  unpaidBookings: number;
  confirmedGuests: number;
  cancelledBookings: number;
  projectedRevenue: string;
  isLoading?: boolean;
}

const overviewItems = [
  {
    key: "sessionsToday",
    label: "Sessions today",
    helper: "Bookings scheduled for today",
    icon: CalendarClock,
    tone: "primary",
  },
  {
    key: "pendingBookings",
    label: "Pending bookings",
    helper: "Reservations awaiting approval",
    icon: Clock3,
    tone: "secondary",
  },
  {
    key: "unpaidBookings",
    label: "Unpaid bookings",
    helper: "Payments still outstanding",
    icon: CircleDollarSign,
    tone: "destructive",
  },
  {
    key: "confirmedGuests",
    label: "Confirmed guests",
    helper: "Expected participants across sessions",
    icon: Users,
    tone: "primary",
  },
  {
    key: "cancelledBookings",
    label: "Cancelled / rejected",
    helper: "Sessions that reopened capacity",
    icon: TicketX,
    tone: "secondary",
  },
  {
    key: "projectedRevenue",
    label: "Projected revenue",
    helper: "Visible value from listed bookings",
    icon: TicketCheck,
    tone: "primary",
  },
] as const;

export default function ActivityBookingsOverview(props: ActivityBookingsOverviewProps) {
  const items = overviewItems.map((item) => ({
    ...item,
    value: props[item.key],
  }));

  return (
    <TableOverview items={items} className="xl:grid-cols-3" isLoading={props.isLoading} />
  );
}
