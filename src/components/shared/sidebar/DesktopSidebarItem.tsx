"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { NavItem } from "@/types/sidebar.types";

import SidebarTooltip from "./SidebarTooltip";
import { hasActiveChild, isItemActive } from "./utils";

interface DesktopSidebarItemProps {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  showLabels: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function DesktopSidebarItem({
  item,
  pathname,
  isCollapsed,
  showLabels,
  isExpanded,
  onToggle,
}: DesktopSidebarItemProps) {
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
            isCollapsed ? "justify-center px-0 py-3" : "justify-between gap-2 px-3 py-2"
          }`}
        >
          <Link
            href={item.path}
            className={`flex min-w-0 items-center ${
              isCollapsed ? "justify-center" : "flex-1 gap-3 px-1 py-1"
            }`}
            aria-label={item.label}
          >
            <span className="shrink-0 text-current transition-colors">{item.icon}</span>
            {!isCollapsed ? (
              <span
                className={`font-main block overflow-hidden whitespace-nowrap text-sm font-semibold tracking-[0.02em] transition-[max-width,opacity,transform] duration-200 ${
                  showLabels
                    ? "max-w-[10rem] translate-x-0 opacity-100 delay-150"
                    : "max-w-0 -translate-x-1 opacity-0 delay-0"
                }`}
              >
                {item.label}
              </span>
            ) : null}
          </Link>

          {!isCollapsed && hasChildren ? (
            <button
              type="button"
              onClick={onToggle}
              aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
              className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-[opacity,transform,colors] duration-200 ${
                active
                  ? "bg-primary/8 text-primary hover:bg-primary/12"
                  : "text-sidebar-foreground/60 hover:bg-primary/7 hover:text-sidebar-foreground/80"
              } ${showLabels ? "translate-x-0 opacity-100 delay-150" : "translate-x-1 opacity-0 delay-0"}`}
              tabIndex={showLabels ? 0 : -1}
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
              isExpanded && showLabels
                ? "grid-rows-[1fr] pb-2 opacity-100 delay-150"
                : "grid-rows-[0fr] pb-0 opacity-0 delay-0"
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
                      className={`ml-6 flex min-h-10 items-center rounded-xl px-3 py-2 font-main text-sm font-semibold transition-[opacity,transform,colors,background-color] duration-200 ${
                        childActive
                          ? "bg-primary/8 text-primary"
                          : "text-sidebar-foreground/60 hover:bg-primary/7 hover:text-sidebar-foreground/80"
                      } ${
                        showLabels
                          ? "translate-x-0 opacity-100 delay-150"
                          : "-translate-x-1 opacity-0 delay-0"
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
