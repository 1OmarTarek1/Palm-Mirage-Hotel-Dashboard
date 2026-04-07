"use client";

import Image from "next/image";

interface SidebarBrandProps {
  collapsed: boolean;
  showLabels: boolean;
}

export default function SidebarBrand({
  collapsed,
  showLabels,
}: SidebarBrandProps) {
  return (
    <div className="relative mb-4 pb-3 flex h-[3.75rem] items-center after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--border)_92%,transparent)_0%,color-mix(in_srgb,var(--border)_72%,transparent)_68%,transparent_100%)] after:content-['']">
      <div className={`flex w-full ${collapsed ? "justify-center" : "items-center gap-3 pl-6"}`}>
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-card/70 shadow-sm">
          <Image
            src="/logo.png"
            alt="Palm Mirage Logo"
            fill
            sizes="44px"
            quality={70}
            className="object-contain p-1.5"
          />
        </div>
        {!collapsed ? (
          <div
            className={`min-w-0 overflow-hidden transition-[max-width,opacity,transform] duration-200 ${
              showLabels
                ? "max-w-[10rem] translate-x-0 opacity-100 delay-150"
                : "max-w-0 -translate-x-1 opacity-0 delay-0"
            }`}
          >
            <p className="font-header whitespace-nowrap text-[14px] font-semibold tracking-tight text-primary">
              Palm Mirage
            </p>
            <p className="font-main mt-0.5 whitespace-nowrap text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Luxury Hotel
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
