import {
  Bed,
  Building2,
  Calendar,
  Menu,
  Users,
} from "lucide-react";
import { createElement } from "react";

import { NavItem } from "@/types/sidebar.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Users",
    icon: createElement(Users, { size: 18 }),
    path: "/dashboard/users",
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
        label: "Bookings",
        icon: null,
        path: "/dashboard/rooms/bookings",
      },
    ],
  },
  {
    label: "Facilities",
    icon: createElement(Building2, { size: 18 }),
    path: "/dashboard/facilities",
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
        label: "Bookings",
        icon: null,
        path: "/dashboard/activities/bookings",
      },
    ],
  },
  {
    label: "Menu",
    icon: createElement(Menu, { size: 18 }),
    path: "/dashboard/menu",
  },
];
