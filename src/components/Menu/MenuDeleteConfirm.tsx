import React from "react";
import { MenuItem } from "./data";

interface MenuDeleteConfirmProps {
  item: MenuItem;
}

const MenuDeleteConfirm: React.FC<MenuDeleteConfirmProps> = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        {/* Placeholder for an alert circle icon or icon-picker used in the app */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Are you absolutely sure?</h3>
        <p className="max-w-[320px] text-sm text-muted-foreground">
          This action will permanently delete <span className="font-semibold text-foreground">{item.name}</span> from the menu. This action cannot be undone.
        </p>
      </div>

      <div className="mx-auto mt-4 w-full max-w-[280px] overflow-hidden rounded-xl border border-border bg-muted/50 p-3">
        <div className="flex items-center gap-3">
          {item.image && (
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDeleteConfirm;
