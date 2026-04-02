import { NavItem } from "@/types/sidebar.types";

import { NAV_ITEMS } from "./navItems";

export function isItemActive(pathname: string, path: string) {
  return pathname === path || (path !== "/dashboard" && pathname.startsWith(path));
}

export function hasActiveChild(pathname: string, item: NavItem) {
  return item.children?.some((child) => isItemActive(pathname, child.path)) ?? false;
}

export function getInitialExpandedGroups(pathname: string) {
  return NAV_ITEMS.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children?.length) {
      acc[item.label] = hasActiveChild(pathname, item);
    }

    return acc;
  }, {});
}
