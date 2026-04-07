import { Armchair, CircleGauge, LayoutGrid, UtensilsCrossed } from "lucide-react";

import TableOverview from "@/components/shared/table/TableOverview";

interface RestaurantOverviewProps {
  totalTables: number;
  totalSeats: number;
  averageSeats: string;
  largestTableSize: number;
  isLoading?: boolean;
}

const cards = [
  {
    key: "totalTables",
    label: "Tables ready",
    helper: "Configured dining tables",
    icon: LayoutGrid,
    tone: "primary",
  },
  {
    key: "totalSeats",
    label: "Total seats",
    helper: "Current dining capacity",
    icon: Armchair,
    tone: "secondary",
  },
  {
    key: "averageSeats",
    label: "Average seats",
    helper: "Per-table seating average",
    icon: CircleGauge,
    tone: "primary",
  },
  {
    key: "largestTableSize",
    label: "Largest table",
    helper: "Best table for group bookings",
    icon: UtensilsCrossed,
    tone: "secondary",
  },
] as const;

export default function RestaurantOverview(props: RestaurantOverviewProps) {
  const items = cards.map((card) => ({
    ...card,
    value: props[card.key],
  }));

  return (
    <TableOverview items={items} isLoading={props.isLoading} />
  );
}
