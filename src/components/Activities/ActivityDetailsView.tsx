"use client";

import Image from "next/image";
import type { Activity } from "./data";

interface ActivityDetailsViewProps {
  activity: Activity;
}

export default function ActivityDetailsView({ activity }: ActivityDetailsViewProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-border bg-muted">
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
            <p className="font-main text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {activity.label}
            </p>
            <h3 className="font-header mt-2 text-2xl font-bold text-foreground">{activity.title}</h3>
          </div>

          <p className="font-main text-sm leading-7 text-muted-foreground">{activity.description}</p>

          <div>
            <h4 className="font-header text-sm font-semibold text-foreground">Highlights</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {activity.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="font-main rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          {activity.stats.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
              {activity.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="rounded-2xl border border-border bg-muted/35 px-4 py-3">
                  <p className="font-header text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="font-main mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-3 rounded-[28px] border border-border bg-muted/35 p-5">
          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Category</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.category}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Icon</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.icon}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Created At</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.createdAt}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card px-4 py-3">
            <p className="font-main text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Activity ID</p>
            <p className="font-main mt-1 text-sm font-semibold text-foreground">{activity.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
