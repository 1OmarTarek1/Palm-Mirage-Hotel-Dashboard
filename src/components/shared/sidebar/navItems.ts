import {
  Bed,
  Building2,
  Calendar,
  House,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { createElement } from "react";

import { NavItem } from "@/types/sidebar.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    icon: createElement(House, { size: 18 }),
    path: "/dashboard",
  },
  {
    label: "Users",
    icon: createElement(Users, { size: 18 }),
    path: "/dashboard/users",
  },
  {
    label: "Facilities",
    icon: createElement(Building2, { size: 18 }),
    path: "/dashboard/facilities",
  },
  {
    label: "Rooms",
    icon: createElement(Bed, { size: 18 }),
    path: "/dashboard/rooms",
    children: [
      {
        label: "All Rooms",
        icon: null,
        path: "/dashboard/rooms",
      },
      {
        label: "Room bookings",
        icon: null,
        path: "/dashboard/rooms/bookings",
      },
      {
        label: "Amenities",
        icon: null,
        path: "/dashboard/rooms/amenities",
      },
    ],
  },
  {
    label: "Activities",
    icon: createElement(Calendar, { size: 18 }),
    path: "/dashboard/activities",
    children: [
      {
        label: "All Activities",
        icon: null,
        path: "/dashboard/activities",
      },
      {
        label: "Schedules",
        icon: null,
        path: "/dashboard/activities/schedules",
      },
      {
        label: "Activity bookings",
        icon: null,
        path: "/dashboard/activities/bookings",
      },
    ],
  },
  {
    label: "Restaurant",
    icon: createElement(UtensilsCrossed, { size: 18 }),
    path: "/dashboard/restaurant",
    children: [
      {
        label: "Tables",
        icon: null,
        path: "/dashboard/restaurant",
      },
      {
        label: "Restaurant bookings",
        icon: null,
        path: "/dashboard/restaurant/bookings",
      },
      {
        label: "Menu",
        icon: null,
        path: "/dashboard/menu",
      },
    ],
  },
];
