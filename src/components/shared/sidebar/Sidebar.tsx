"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "./navItems";

function SidebarTooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 hidden -translate-y-1/2 rounded-xl border border-primary/20 bg-card px-3 py-1.5 text-xs font-semibold tracking-[0.08em] whitespace-nowrap text-foreground shadow-xl group-hover:block">
      {label}
    </div>
  );
}

function isItemActive(pathname: string, path: string) {
  return pathname === path || (path !== "/dashboard" && pathname.startsWith(path));
}

function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sidebar-border/80 bg-[color-mix(in_srgb,var(--card)_92%,white_8%)]/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(15,17,21,0.12)] backdrop-blur-xl md:hidden">
      <nav>
        <ul className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(pathname, item.path);

            return (
              <li key={item.label} className="flex flex-1">
                <Link
                  href={item.path}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-sidebar-foreground/75 hover:bg-primary/10 hover:text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <span className="flex h-5 items-center justify-center">{item.icon}</span>
                  <span className="truncate text-[10px] font-semibold tracking-[0.12em] uppercase">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function TabletSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-20 shrink-0 border-r border-sidebar-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_10%,var(--sidebar))_0%,var(--sidebar)_22%,var(--sidebar)_100%)] px-3 py-5 text-sidebar-foreground md:flex lg:hidden">
      <nav className="flex-1 overflow-visible">
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(pathname, item.path);

            return (
              <li key={item.label} className="group relative">
                <Link
                  href={item.path}
                  className={`flex justify-center rounded-2xl border px-0 py-3 transition-all duration-200 ${
                    active
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                      : "border-transparent text-sidebar-foreground hover:border-primary/15 hover:bg-primary/8 hover:text-foreground"
                  }`}
                  aria-label={item.label}
                >
                  <span className={active ? "text-current" : "text-primary"}>{item.icon}</span>
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

function DesktopSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-sidebar-border/70 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_12%,var(--sidebar))_0%,var(--sidebar)_22%,var(--sidebar)_100%)] text-sidebar-foreground shadow-[inset_-1px_0_0_rgba(198,169,105,0.08)] transition-all duration-300 lg:flex ${
        isCollapsed ? "w-24" : "w-[17.5rem]"
      }`}
    >
      <div className="flex h-full w-full flex-col px-3 py-5">
        <div className="mb-4 border-b border-sidebar-border/70 pb-4">
          {!isCollapsed ? (
            <>
              <p className="font-header text-[11px] font-black uppercase tracking-[0.28em] text-primary/90">
                Navigation
              </p>
              <p className="font-main mt-2 text-xs leading-relaxed text-muted-foreground">
                Quick access to the hotel dashboard sections.
              </p>
            </>
          ) : (
            <p className="text-center text-[11px] font-black uppercase tracking-[0.28em] text-primary/80">
              Nav
            </p>
          )}
        </div>

        <nav className="flex-1 overflow-visible">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(pathname, item.path);

              return (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.path}
                    className={`flex items-center rounded-2xl border transition-all duration-200 ${
                      isCollapsed
                        ? "justify-center px-0 py-3"
                        : "justify-start gap-3 px-4 py-3.5"
                    } ${
                      active
                        ? "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/15"
                        : "border-transparent text-sidebar-foreground hover:border-primary/15 hover:bg-primary/8 hover:text-foreground"
                    }`}
                    aria-label={item.label}
                  >
                    <span className={active ? "text-current" : "text-primary"}>{item.icon}</span>
                    {!isCollapsed ? (
                      <span className="font-main text-sm font-semibold tracking-[0.02em]">
                        {item.label}
                      </span>
                    ) : null}
                  </Link>
                  {isCollapsed ? <SidebarTooltip label={item.label} /> : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-4 border-t border-sidebar-border/70 pt-4">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`flex w-full items-center rounded-2xl border border-primary/25 bg-primary/10 px-3 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-primary/16 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!isCollapsed ? <span className="font-main">Collapse Sidebar</span> : null}
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <>
      <MobileNav />
      <TabletSidebar />
      <DesktopSidebar />
    </>
  );
}
