"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { NAV_ITEMS } from "./navItems";
import { hasActiveChild, isItemActive } from "./utils";

export default function MobileNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0, opacity: 0 });

  const activeIndex = useMemo(
    () =>
      NAV_ITEMS.findIndex(
        (item) => isItemActive(pathname, item.path) || hasActiveChild(pathname, item),
      ),
    [pathname],
  );

  useEffect(() => {
    const updateIndicator = () => {
      const listElement = listRef.current;
      const activeElement = itemRefs.current[activeIndex];

      if (!listElement || !activeElement || activeIndex < 0) {
        setIndicatorStyle((current) => ({ ...current, opacity: 0 }));
        return;
      }

      setIndicatorStyle({
        x: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1,
      });
    };

    updateIndicator();

    const resizeObserver = new ResizeObserver(updateIndicator);
    if (listRef.current) {
      resizeObserver.observe(listRef.current);
    }
    itemRefs.current.forEach((item) => {
      if (item) resizeObserver.observe(item);
    });

    window.addEventListener("resize", updateIndicator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(15,17,21,0.12)] backdrop-blur-md md:hidden">
      <nav>
        <ul
          ref={listRef}
          className="relative grid grid-cols-6 gap-2 rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--primary)_6%,var(--card))_0%,var(--card)_100%)] p-2 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-2 bottom-2 rounded-[20px] border border-primary/20 bg-primary/8 shadow-sm shadow-primary/8 will-change-transform transition-[transform,opacity] duration-300 ease-out"
            style={{
              width: indicatorStyle.width || undefined,
              transform: `translate3d(${indicatorStyle.x}px, 0, 0)`,
              opacity: indicatorStyle.opacity,
            }}
          />
          {NAV_ITEMS.map((item, index) => {
            const active = isItemActive(pathname, item.path) || hasActiveChild(pathname, item);

            return (
              <li
                key={item.label}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className="group relative min-w-0"
              >
                <Link
                  href={item.path}
                  className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-[20px] border transition-all duration-200 ${
                    active
                      ? "border-transparent bg-transparent text-primary"
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
