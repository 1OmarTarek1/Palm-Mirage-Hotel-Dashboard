"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "./navItems";
import SidebarTooltip from "./SidebarTooltip";
import { hasActiveChild, isItemActive } from "./utils";

export default function TabletSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 z-50 hidden h-[calc(100vh-4rem)] w-20 shrink-0 border-r border-sidebar-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_10%,var(--background))_0%,var(--background)_22%,var(--background)_100%)] px-3 py-5 text-sidebar-foreground md:flex lg:hidden">
      <nav className="flex-1 overflow-visible">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(pathname, item.path) || hasActiveChild(pathname, item);

            return (
              <li key={item.label} className="group relative">
                <Link
                  href={item.path}
                  className={`flex justify-center rounded-2xl border px-0 py-3 transition-all duration-200 ${
                    active
                      ? "border-primary/25 bg-primary/8 text-primary shadow-lg shadow-primary/8"
                      : "border-transparent text-sidebar-foreground/65 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/80"
                  }`}
                  aria-label={item.label}
                >
                  <span className="text-current transition-colors">{item.icon}</span>
                </Link>
                <SidebarTooltip label={item.label} />
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
