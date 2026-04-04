"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "./navItems";
import SidebarCornerAccent from "./SidebarCornerAccent";
import DesktopSidebarItem from "./DesktopSidebarItem";
import SidebarBrand from "./SidebarBrand";
import SidebarCollapseButton from "./SidebarCollapseButton";
import { getInitialExpandedGroups, hasActiveChild } from "./utils";

export default function DesktopSidebar({
  forceCollapsed = false,
  className = "",
}: {
  forceCollapsed?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(!forceCollapsed);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    getInitialExpandedGroups(pathname)
  );
  const collapsed = forceCollapsed || isCollapsed;

  useEffect(() => {
    if (collapsed) {
      setShowLabels(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowLabels(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [collapsed]);

  useEffect(() => {
    setExpandedGroups((current) => {
      const next = { ...current };

      NAV_ITEMS.forEach((item) => {
        if (item.children?.length && hasActiveChild(pathname, item)) {
          next[item.label] = true;
        }
      });

      return next;
    });
  }, [pathname]);

  const handleToggleGroup = (label: string) => {
    setExpandedGroups((current) => {
      const isCurrentlyOpen = current[label] ?? false;
      const nextState: Record<string, boolean> = {};

      NAV_ITEMS.forEach((item) => {
        if (item.children?.length) {
          nextState[item.label] = item.label === label ? !isCurrentlyOpen : false;
        }
      });

      return nextState;
    });
  };

  return (
    <aside
      className={`relative sticky top-0 z-[150] hidden h-screen shrink-0 overflow-visible bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_10%,var(--background))_0%,color-mix(in_srgb,var(--primary)_10%,var(--background))_5.5rem,color-mix(in_srgb,var(--primary)_9.5%,var(--background))_10rem,color-mix(in_srgb,var(--primary)_8.5%,var(--background))_15rem,color-mix(in_srgb,var(--primary)_6.5%,var(--background))_21rem,color-mix(in_srgb,var(--primary)_4%,var(--background))_30rem,var(--background)_100%)] text-sidebar-foreground transition-all duration-300 after:pointer-events-none after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-[linear-gradient(180deg,transparent_0%,transparent_20%,color-mix(in_srgb,var(--border)_48%,transparent)_42%,color-mix(in_srgb,var(--border)_82%,transparent)_100%)] after:content-[''] ${
        collapsed ? "w-24" : "w-[17.5rem]"
      } ${className}`.trim()}
    >
      <SidebarCornerAccent />

      <div className="flex h-full w-full flex-col px-3 pb-5 pt-3">
        <SidebarBrand collapsed={collapsed} showLabels={showLabels} />

        <nav className={`relative flex-1 ${collapsed ? "overflow-visible" : "overflow-hidden"}`}>
          <div
            className={`h-full ${
              collapsed
                ? "overflow-visible"
                : "overflow-y-auto overflow-x-hidden pr-1 [scrollbar-gutter:stable]"
            }`}
          >
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <DesktopSidebarItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  isCollapsed={collapsed}
                  showLabels={showLabels}
                  isExpanded={expandedGroups[item.label] ?? false}
                  onToggle={() => handleToggleGroup(item.label)}
                />
              ))}
            </ul>
          </div>
        </nav>

        {!forceCollapsed ? (
          <SidebarCollapseButton
            collapsed={collapsed}
            showLabels={showLabels}
            onToggle={() => setIsCollapsed((prev) => !prev)}
          />
        ) : null}
      </div>
    </aside>
  );
}
