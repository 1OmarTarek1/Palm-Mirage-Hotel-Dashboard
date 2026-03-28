import { createElement } from "react";
import {
    Bed,
    Briefcase,
    Calendar,
    Home,
    Menu,
    Users,
} from "lucide-react";

import { NavItem } from "@/types/sidebar.types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: createElement(Home, { size: 18 }),
    href: "/dashboard",
  },
  {
    label: "Users",
    icon: createElement(Users, { size: 18 }),
    href: "/dashboard/users",
  },
  {
    label: "Rooms",
    icon: createElement(Bed, { size: 18 }),
    href: "/dashboard/rooms",
  },
  {
    label: "Facilities",
    icon: createElement(Menu, { size: 18 }),
    href: "/dashboard/facilities",
  },
  {
    label: "Activities",
    icon: createElement(Calendar, { size: 18 }),
    href: "/dashboard/activities",
  },
  {
    label: "Menu",
    icon: createElement(Menu, { size: 18 }),
    href: "/dashboard/menu",
  },
  {
    label: "Restaurant",
    icon: createElement(Menu, { size: 18 }),
    href: "/dashboard/restaurant",
  },
  {
    label: "Add Dish",
    icon: createElement(Briefcase, { size: 18 }),
    href: "/dashboard/restaurant/add",
  },
];