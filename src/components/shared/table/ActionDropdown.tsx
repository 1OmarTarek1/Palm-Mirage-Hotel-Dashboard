"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Edit3, Trash2 } from "lucide-react";
import { RowAction, RowActionConfig } from "./types";

interface ActionDropdownProps {
  actions: Array<Pick<RowActionConfig<unknown>, "key" | "label" | "variant"> & { onClick: () => void }>;
}

const actionMeta: Record<RowAction, { label: string; icon: React.ReactNode }> = {
  view: {
    label: "View Details",
    icon: <Eye size={15} className="text-gray-400" />,
  },
  edit: {
    label: "Edit",
    icon: <Edit3 size={15} className="text-gray-400" />,
  },
  delete: {
    label: "Delete",
    icon: <Trash2 size={15} className="text-red-400" />,
  },
};

export default function ActionDropdown({ actions }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasPrimaryActions = actions.some((action) => action.key !== "delete");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (actions.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-100 animate-in fade-in zoom-in duration-200">
          {actions.map((action, index) => {
            const isDelete = action.key === "delete";
            const shouldShowDivider = isDelete && hasPrimaryActions;
            const meta = actionMeta[action.key];

            return (
              <React.Fragment key={`${action.key}-${index}`}>
                {shouldShowDivider && <div className="my-1.5 h-px bg-gray-100" />}
              <button
                type="button"
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-xs transition-colors ${
                  isDelete || action.variant === "danger"
                    ? "font-semibold text-red-600 hover:bg-red-50"
                    : "font-medium text-gray-700 hover:bg-gray-50"
                }`}
              >
                {meta.icon}
                {action.label ?? meta.label}
              </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
