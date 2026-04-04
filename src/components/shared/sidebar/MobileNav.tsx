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
        <ul className="grid grid-cols-6 gap-2 rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_6%,var(--card))_0%,var(--card)_100%)] p-2 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(pathname, item.path) || hasActiveChild(pathname, item);

            return (
              <li key={item.label} className="group relative min-w-0">
                <Link
                  href={item.path}
                  className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-[20px] border transition-all duration-200 ${
                    active
                      ? "border-primary/20 bg-primary/8 text-primary shadow-sm shadow-primary/8"
                      : "border-transparent text-sidebar-foreground/50 hover:border-primary/12 hover:bg-primary/7 hover:text-sidebar-foreground/75"
                  }`}
                  aria-label={item.label}
                  title={item.label}
                >
                  <span className="flex h-5 items-center justify-center">{item.icon}</span>
                </Link>

                <div className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 z-[70] hidden -translate-x-1/2 whitespace-nowrap rounded-xl border border-primary/20 bg-card px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-primary shadow-xl group-hover:block group-focus-within:block">
                  {item.label}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
