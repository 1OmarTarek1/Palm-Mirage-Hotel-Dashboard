import {
  Bed,
  Building2,
  Calendar,
  Home,
  Menu,
  Users,
  Utensils
} from "lucide-react";
import { createElement } from "react";

import { NavItem } from "@/types/sidebar.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: createElement(Home, { size: 18 }),
    path: "/dashboard",
  },
  {
    label: "Users",
    icon: createElement(Users, { size: 18 }),
    path: "/dashboard/users",
  },
  {
    label: "Rooms",
    icon: createElement(Bed, { size: 18 }),
    path: "/dashboard/rooms",
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
  },
  {
    label: "Menu",
    icon: createElement(Menu, { size: 18 }),
    path: "/dashboard/menu",
  },
  {
    label: "Restaurant",
    icon: createElement(Utensils, { size: 18 }),
    path: "/dashboard/restaurant",
  },
];