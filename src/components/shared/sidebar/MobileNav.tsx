"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "./navItems";
import { hasActiveChild, isItemActive } from "./utils";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(15,17,21,0.12)] backdrop-blur-md md:hidden">
      <nav>
        <ul className="flex items-center gap-2 rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_6%,var(--card))_0%,var(--card)_100%)] p-2 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(pathname, item.path) || hasActiveChild(pathname, item);

            return (
              <li key={item.label} className="flex flex-1">
                <Link
                  href={item.path}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[22px] border px-2 py-2.5 transition-all duration-200 ${
                    active
                      ? "border-primary/20 bg-primary/8 text-primary shadow-sm shadow-primary/8"
                      : "border-transparent text-sidebar-foreground/50 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/75"
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
