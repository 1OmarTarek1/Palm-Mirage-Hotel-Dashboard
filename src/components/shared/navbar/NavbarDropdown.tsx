"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type DropdownItemBase = {
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
  className?: string;
};

type DropdownButtonItem = DropdownItemBase & {
  onClick: () => void;
  href?: never;
};

type DropdownLinkItem = DropdownItemBase & {
  href: string;
  onClick?: never;
};

export type NavbarDropdownItem = DropdownButtonItem | DropdownLinkItem;

interface NavbarDropdownProps {
  isOpen: boolean;
  className?: string;
  children?: ReactNode;
}

interface NavbarDropdownSectionProps {
  children: ReactNode;
  className?: string;
}

interface NavbarDropdownItemsProps {
  items: NavbarDropdownItem[];
  onItemClick?: () => void;
}

export function NavbarDropdown({
  isOpen,
  className,
  children,
}: NavbarDropdownProps) {
  return (
    <div
      className={cn(
        "absolute right-0 top-full mt-4 overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-2xl backdrop-blur-2xl transition-all duration-200",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function NavbarDropdownHeader({
  children,
  className,
}: NavbarDropdownSectionProps) {
  return (
    <div className={cn("border-b border-border/30 px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function NavbarDropdownSection({
  children,
  className,
}: NavbarDropdownSectionProps) {
  return <div className={cn("p-2", className)}>{children}</div>;
}

export function NavbarDropdownDivider({ className }: { className?: string }) {
  return <div className={cn("border-t border-border/30", className)} />;
}

export function NavbarDropdownItems({
  items,
  onItemClick,
}: NavbarDropdownItemsProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const itemClassName = cn(
          "font-main flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
          item.isActive
            ? "bg-primary/10 text-primary"
            : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
          item.className,
        );

        if ("href" in item) {
          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              onClick={onItemClick}
              className={itemClassName}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              item.onClick();
              onItemClick?.();
            }}
            className={itemClassName}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
