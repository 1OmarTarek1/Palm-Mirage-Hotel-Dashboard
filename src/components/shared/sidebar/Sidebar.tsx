"use client";

import { ChevronRight, Hotel } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "./navItems";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      try {
        setIsCollapsed(window.innerWidth < 900);
      } catch (error) {
        console.error("Sidebar width detection failed", error);
        setHasError(true);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (isCollapsed === null) return null;

  return (
    <div
      className={`sticky top-0 h-screen shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      }`}
    >
      <aside className="flex flex-col h-full text-sidebar-foreground bg-sidebar border-r border-sidebar-border ring-1 ring-sidebar-ring transition-colors duration-300">
        <header className="px-4 py-4 border-b border-sidebar-border mt-20">
          <div
            className={`flex items-center transition-all duration-300 ${
              isCollapsed ? "justify-center" : "justify-start gap-3"
            }`}
          >
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary">
              <Hotel className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>

            {/* Title */}
            {!isCollapsed && (
              <div className="flex flex-col leading-tight">
                <h1 className="text-base font-semibold text-sidebar-foreground">
                  Hotel Dashboard
                </h1>
                <span className="text-xs text-sidebar-accent-foreground">
                  Management System
                </span>
              </div>
            )}
          </div>
        </header>

        <div className="hidden md:flex items-center justify-between p-3 relative">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="absolute -right-6 top-5 -translate-y-1/2 rounded-full bg-sidebar-accent p-2 shadow-md transition duration-300 hover:bg-sidebar-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary text-sidebar-foreground"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span
              className={`block transition-transform duration-300 ${
                isCollapsed ? "rotate-0" : "rotate-180"
              }`}
            >
              <ChevronRight size={18} />
            </span>
          </button>
        </div>

        <nav className="mt-5 flex-1 overflow-y-auto">
          {hasError ? (
            <div className="m-4 text-xs text-destructive bg-destructive/15 p-2 rounded">
              Sidebar failed to load. Please reload.
            </div>
          ) : (
            <ul className="flex flex-col gap-1 px-2">
              {Array.isArray(NAV_ITEMS) && NAV_ITEMS.length > 0 ? (
                NAV_ITEMS.filter((item) => item?.label && item?.href).map(
                  (item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href ?? "#"}
                        className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-primary ${
                          isCollapsed ? "justify-center" : "justify-start"
                        }`}
                      >
                        {item.icon}
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  ),
                )
              ) : (
                <li className="text-xs text-slate-400 px-3 py-2">
                  No navigation items available
                </li>
              )}
            </ul>
          )}
        </nav>
      </aside>
    </div>
  );
}
