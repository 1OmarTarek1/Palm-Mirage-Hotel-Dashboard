"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Eye, Edit3, Trash2 } from "lucide-react";
import { RowAction, RowActionConfig } from "./types";

interface ActionDropdownProps {
  actions: Array<Pick<RowActionConfig<unknown>, "key" | "label" | "variant"> & { onClick: () => void }>;
}

interface DropdownPosition {
  top: number;
  left: number;
  originClassName: string;
}

const actionMeta: Record<RowAction, { label: string; icon: React.ReactNode }> = {
  view: {
    label: "View Details",
    icon: <Eye size={15} className="text-primary/85" />,
  },
  edit: {
    label: "Edit",
    icon: <Edit3 size={15} className="text-primary/85" />,
  },
  delete: {
    label: "Delete",
    icon: <Trash2 size={15} className="text-red-500 dark:text-red-400" />,
  },
};

export default function ActionDropdown({ actions }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasPrimaryActions = actions.some((action) => action.key !== "delete");

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 176;
    const menuHeight = actions.length * 46 + (hasPrimaryActions ? 24 : 12);
    const gap = 8;
    const viewportPadding = 12;

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow;

    const top = openUpward
      ? Math.max(viewportPadding, triggerRect.top - menuHeight - gap)
      : Math.min(
          window.innerHeight - menuHeight - viewportPadding,
          triggerRect.bottom + gap,
        );

    const alignedLeft = triggerRect.right - menuWidth;
    const left = Math.min(
      Math.max(viewportPadding, alignedLeft),
      window.innerWidth - menuWidth - viewportPadding,
    );

    setPosition({
      top,
      left,
      originClassName: openUpward ? "origin-bottom-right" : "origin-top-right",
    });
  }, [actions.length, hasPrimaryActions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => setIsOpen(false);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  if (actions.length === 0) return null;

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <MoreVertical size={18} />
      </button>

      {portalReady && isOpen && position
        ? createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
              }}
              className={`animate-in fade-in zoom-in duration-200 z-[220] w-44 rounded-xl border border-border bg-popover p-1.5 shadow-xl ring-1 ring-border/60 focus:outline-none ${position.originClassName}`}
            >
              {actions.map((action, index) => {
                const isDelete = action.key === "delete";
                const shouldShowDivider = isDelete && hasPrimaryActions;
                const meta = actionMeta[action.key];

                return (
                  <React.Fragment key={`${action.key}-${index}`}>
                    {shouldShowDivider && <div className="my-1.5 h-px bg-border" />}
                    <button
                      type="button"
                      onClick={() => {
                        action.onClick();
                        setIsOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-main transition-colors ${
                        isDelete || action.variant === "danger"
                          ? "font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/15"
                          : "font-medium text-foreground hover:bg-muted hover:text-primary"
                      }`}
                    >
                      {meta.icon}
                      {action.label ?? meta.label}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
