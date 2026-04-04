"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { NAV_ITEMS } from "./navItems";
import SidebarCornerAccent from "./SidebarCornerAccent";
import DesktopSidebarItem from "./DesktopSidebarItem";
import SidebarBrand from "./SidebarBrand";
import SidebarCollapseButton from "./SidebarCollapseButton";
import { getInitialExpandedGroups } from "./utils";

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
  const [hasScroll, setHasScroll] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    getInitialExpandedGroups(pathname)
  );
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
    setExpandedGroups(getInitialExpandedGroups(pathname));
  }, [pathname]);

  useEffect(() => {
    if (collapsed) {
      setHasScroll(false);
      return;
    }

    const element = scrollContainerRef.current;
    if (!element) return;

    const updateScrollState = () => {
      setHasScroll(element.scrollHeight > element.clientHeight + 1);
    };

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    window.addEventListener("resize", updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [collapsed, expandedGroups, showLabels, scrollContainerRef]);

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

      <div className="flex h-full w-full flex-col pl-1 pr-3 pb-5 pt-3">
        <SidebarBrand collapsed={collapsed} showLabels={showLabels} />

        <nav className={`relative flex-1 ${collapsed ? "overflow-visible" : "overflow-hidden"}`}>
          <div
            ref={scrollContainerRef}
            className={`h-full ${
              collapsed
                ? "overflow-visible"
                : "overflow-y-auto overflow-x-hidden [direction:rtl]"
            }`}
          >
            <ul className={`space-y-2 [direction:ltr] ${hasScroll ? "pl-1" : "pl-2"}`}>
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
