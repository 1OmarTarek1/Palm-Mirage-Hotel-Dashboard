import { BedDouble, CalendarArrowDown, CalendarArrowUp, CreditCard, Hotel } from "lucide-react";

import TableOverview from "@/components/shared/table/TableOverview";

interface RoomBookingsOverviewProps {
  arrivalsToday: number;
  departuresToday: number;
  pendingBookings: number;
  unpaidBookings: number;
  checkedInGuests: number;
  totalRevenue: string;
  isLoading?: boolean;
}

const overviewItems = [
  {
    key: "arrivalsToday",
    label: "Arrivals today",
    helper: "Guests expected to check in",
    icon: CalendarArrowDown,
    tone: "primary",
  },
  {
    key: "departuresToday",
    label: "Departures today",
    helper: "Rooms scheduled to turn over",
    icon: CalendarArrowUp,
    tone: "secondary",
  },
  {
    key: "pendingBookings",
    label: "Pending bookings",
    helper: "Reservations waiting confirmation",
    icon: Hotel,
    tone: "destructive",
  },
  {
    key: "unpaidBookings",
    label: "Unpaid bookings",
    helper: "Payment follow-up needed",
    icon: CreditCard,
    tone: "secondary",
  },
  {
    key: "checkedInGuests",
    label: "Checked-in now",
    helper: "Currently in-house reservations",
    icon: BedDouble,
    tone: "primary",
  },
  {
    key: "totalRevenue",
    label: "Booked revenue",
    helper: "Visible value from listed reservations",
    icon: CreditCard,
    tone: "primary",
  },
] as const;

export default function RoomBookingsOverview(props: RoomBookingsOverviewProps) {
  const items = overviewItems.map((item) => ({
    ...item,
    value: props[item.key],
  }));

  return (
    <TableOverview items={items} className="xl:grid-cols-3" isLoading={props.isLoading} />
  );
}
