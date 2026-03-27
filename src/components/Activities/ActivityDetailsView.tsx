"use client";

import Image from "next/image";
import type { Activity } from "./data";

interface ActivityDetailsViewProps {
  activity: Activity;
}

export default function ActivityDetailsView({ activity }: ActivityDetailsViewProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] bg-slate-100">
        <div className="relative h-64 w-full md:h-80">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-600">
              {activity.label}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{activity.title}</h3>
          </div>

          <p className="text-sm leading-7 text-slate-600">{activity.description}</p>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Highlights</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {activity.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {activity.stats.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              {activity.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-3 rounded-[28px] border border-slate-100 bg-slate-50 p-5">
          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Category</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{activity.category}</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Icon</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{activity.icon}</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Created At</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{activity.createdAt}</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Activity ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{activity.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
