"use client";

import type { Activity } from "./data";

interface ActivityDeleteConfirmProps {
  activity: Activity;
}

export default function ActivityDeleteConfirm({ activity }: ActivityDeleteConfirmProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-red-100 bg-red-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-500">
          Delete Activity
        </p>
        <h3 className="mt-2 text-xl font-bold text-slate-900">{activity.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          This action will remove the activity from the current table view. You can use the
          shared modal confirmation here instead of the browser confirm dialog.
        </p>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-slate-100 bg-slate-50 p-5 md:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Category</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{activity.category}</p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Created At</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{activity.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
