"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SidebarCollapseButtonProps {
  collapsed: boolean;
  showLabels: boolean;
  onToggle: () => void;
}

export default function SidebarCollapseButton({
  collapsed,
  showLabels,
  onToggle,
}: SidebarCollapseButtonProps) {
  return (
    <div className="mt-4 border-t border-sidebar-border/70 pt-4">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full cursor-pointer items-center rounded-2xl border border-primary/20 bg-primary/8 px-3 py-3 text-sm font-semibold text-sidebar-foreground/75 shadow-sm transition hover:bg-primary/12 hover:text-sidebar-foreground/85 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
        aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {!collapsed ? (
          <span
            className={`font-main flex items-center gap-2 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ${
              showLabels
                ? "max-w-[12rem] translate-x-0 opacity-100 delay-150"
                : "max-w-0 -translate-x-1 opacity-0 delay-0"
            }`}
          >
            <X size={16} />
            <span>Collapse Sidebar</span>
          </span>
        ) : null}
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sidebar-foreground/80 shadow-md">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </span>
      </button>
    </div>
  );
}
