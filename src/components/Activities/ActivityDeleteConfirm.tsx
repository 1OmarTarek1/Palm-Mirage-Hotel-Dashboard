"use client";

import type { Activity } from "./data";

interface ActivityDeleteConfirmProps {
  activity: Activity;
}

export default function ActivityDeleteConfirm({ activity }: ActivityDeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-red-200/70 bg-red-500/10 p-5">
        <p className="font-main text-sm font-semibold uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
          Delete Activity
        </p>
        <h3 className="font-header mt-2 text-xl font-bold text-foreground">{activity.title}</h3>
        <p className="font-main mt-3 text-sm leading-7 text-muted-foreground">
          This action will remove the activity from the current table view. You can use the
          shared modal confirmation here instead of the browser confirm dialog.
        </p>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-border bg-muted/35 p-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Base Price</p>
          <p className="font-main mt-1 text-sm font-semibold text-foreground">${activity.basePrice}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Category</p>
          <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.category}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created At</p>
          <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
