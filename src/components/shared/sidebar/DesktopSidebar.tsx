"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { NavItem } from "@/types/sidebar.types";

import { NAV_ITEMS } from "./navItems";
import SidebarTooltip from "./SidebarTooltip";
import { getInitialExpandedGroups, hasActiveChild, isItemActive } from "./utils";

function DesktopSidebarItem({
  item,
  pathname,
  isCollapsed,
  isExpanded,
  onToggle,
}: {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const active = isItemActive(pathname, item.path) || hasActiveChild(pathname, item);
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className="group relative">
      <div
        className={`rounded-2xl border transition-all duration-200 ${
          active
            ? "border-primary/25 bg-primary/8 text-primary shadow-lg shadow-primary/8"
            : "border-transparent text-sidebar-foreground/65 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/80"
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center px-0 py-3" : "justify-between gap-2 px-3 py-2.5"
          }`}
        >
          <Link
            href={item.path}
            className={`flex min-w-0 items-center ${
              isCollapsed ? "justify-center" : "flex-1 gap-3 px-1 py-1"
            }`}
            aria-label={item.label}
          >
            <span className="text-current transition-colors">{item.icon}</span>
            {!isCollapsed ? (
              <span className="truncate font-main text-sm font-semibold tracking-[0.02em]">
                {item.label}
              </span>
            ) : null}
          </Link>

          {!isCollapsed && hasChildren ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
              className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors ${
                active
                  ? "bg-primary/8 text-primary hover:bg-primary/12"
                  : "text-sidebar-foreground/60 hover:bg-primary/7 hover:text-sidebar-foreground/80"
              }`}
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          ) : null}
        </div>

        {!isCollapsed && hasChildren ? (
          <div
            className={`grid px-3 transition-[grid-template-rows,opacity,padding] duration-300 ease-out ${
              isExpanded ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-1 pt-1">
                {item.children?.map((child) => {
                  const childActive = pathname === child.path;

                  return (
                    <Link
                      key={`${item.label}-${child.label}`}
                      href={child.path}
                      className={`ml-8 flex rounded-xl px-3 py-2 font-main text-sm font-medium transition-all duration-200 ${
                        childActive
                          ? "bg-primary/8 text-primary"
                          : "text-sidebar-foreground/60 hover:bg-primary/7 hover:text-sidebar-foreground/80"
                      }`}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isCollapsed ? <SidebarTooltip label={item.label} /> : null}
    </li>
  );
}

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    getInitialExpandedGroups(pathname)
  );

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
      className={`sticky top-0 z-50 hidden h-screen shrink-0 border-r border-sidebar-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_12%,var(--background))_0%,var(--background)_22%,var(--background)_100%)] text-sidebar-foreground shadow-[inset_-1px_0_0_rgba(198,169,105,0.08)] transition-all duration-300 lg:flex ${
        isCollapsed ? "w-24" : "w-[17.5rem]"
      }`}
    >
      <div className="flex h-full w-full flex-col px-3 py-5">
        <div className="mb-4 border-b border-sidebar-border/70 pb-4">
          {!isCollapsed ? (
            <Link
              href="/dashboard"
              className={`block rounded-2xl border px-4 py-3 transition-all duration-200 ${
                isItemActive(pathname, "/dashboard")
                  ? "border-primary/25 bg-primary/8 text-sidebar-foreground/80 shadow-md shadow-primary/8"
                  : "border-transparent text-sidebar-foreground/65 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-card/70 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Palm Mirage Logo"
                    fill
                    sizes="44px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-header truncate text-[14px] font-semibold tracking-tight text-primary">
                    Palm Mirage
                  </p>
                  <p className="font-main mt-0.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Dashboard Home
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="group relative">
              <Link
                href="/dashboard"
                className={`flex items-center justify-center rounded-2xl border px-0 py-3 transition-all duration-200 ${
                  isItemActive(pathname, "/dashboard")
                    ? "border-primary/25 bg-primary/8 text-sidebar-foreground/80 shadow-md shadow-primary/8"
                    : "border-transparent text-sidebar-foreground/65 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/80"
                }`}
                aria-label="Dashboard Home"
              >
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-card/70 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Palm Mirage Logo"
                    fill
                    sizes="40px"
                    className="object-contain p-1.5"
                  />
                </div>
              </Link>
              <SidebarTooltip label="Dashboard Home" />
            </div>
          )}
        </div>

        <nav className={`relative flex-1 ${isCollapsed ? "overflow-visible" : "overflow-hidden"}`}>
          <div
            className={`h-full ${
              isCollapsed
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
                  isCollapsed={isCollapsed}
                  isExpanded={expandedGroups[item.label] ?? false}
                  onToggle={() => handleToggleGroup(item.label)}
                />
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-4 border-t border-sidebar-border/70 pt-4">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`flex w-full cursor-pointer items-center rounded-2xl border border-primary/20 bg-primary/8 px-3 py-3 text-sm font-semibold text-sidebar-foreground/75 shadow-sm transition hover:bg-primary/12 hover:text-sidebar-foreground/85 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!isCollapsed ? <span className="font-main">Collapse Sidebar</span> : null}
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sidebar-foreground/80 shadow-md">
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
