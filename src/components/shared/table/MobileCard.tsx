"use client";

import React from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Info,
  LucideIcon,
  MapPin,
  Ticket,
  UserRound,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CellRenderer from "./CellRenderer";
import { Column } from "./types";
import { resolveValue } from "./utils";

function splitColumnsForMobile<T>(columns: Column<T>[]) {
  const actionColumn = columns.find((column) => column.type === "action-dropdown") ?? null;
  const dataColumns = columns.filter((column) => column.type !== "action-dropdown");
  const primaryColumn =
    dataColumns.find((column) => column.type === "image-card") ?? dataColumns[0] ?? null;
  const secondaryColumns = primaryColumn
    ? dataColumns.filter((column) => column !== primaryColumn)
    : dataColumns;
  const badgeColumns = secondaryColumns.filter((column) => column.type === "badge");
  const metricColumns = secondaryColumns.filter((column) => column.type !== "badge");

  return {
    actionColumn,
    primaryColumn,
    badgeColumns,
    metricColumns,
  };
}

function getMetricIcon<T>(column: Column<T>): LucideIcon {
  const title = column.title.toLowerCase();

  if (column.type === "date" || /date|created/.test(title)) {
    return CalendarDays;
  }

  if (/time|start|end|hour/.test(title)) {
    return Clock3;
  }

  if (/price|total|amount|base|rate|cost/.test(title)) {
    return CircleDollarSign;
  }

  if (/guest|user|customer/.test(title)) {
    return UserRound;
  }

  if (/capacity|available|seat|count|qty|quantity|guests/.test(title)) {
    return Users;
  }

  if (/location|place|destination/.test(title)) {
    return MapPin;
  }

  if (/booking|reservation|ticket/.test(title)) {
    return Ticket;
  }

  return Info;
}

interface MobileCardProps<T> {
  row: T;
  columns: Column<T>[];
  itemNumber: number;
}

export default function MobileCard<T extends object>({
  row,
  columns,
  itemNumber,
}: MobileCardProps<T>) {
  const { actionColumn, primaryColumn, badgeColumns, metricColumns } =
    splitColumnsForMobile(columns);
  const itemLabel = String(itemNumber).padStart(2, "0");

  return (
    <Card className="relative gap-0 overflow-hidden rounded-[26px] border border-border/70 bg-card/98 shadow-lg shadow-black/[0.035]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_70%)]" />

      <CardHeader className="relative pb-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="font-header text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/70">
            Card {itemLabel}
          </span>

          {actionColumn ? (
            <div className="-mr-1 -mt-1 shrink-0">
              <CellRenderer
                row={row}
                column={actionColumn}
                resolvedValue={resolveValue(row, actionColumn)}
                displayMode="card"
              />
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          {primaryColumn ? (
            primaryColumn.type === "image-card" ? (
              <CellRenderer
                row={row}
                column={primaryColumn}
                resolvedValue={resolveValue(row, primaryColumn)}
                displayMode="card"
              />
            ) : (
              <div className="space-y-1.5">
                <span className="block font-header text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                  {primaryColumn.title}
                </span>
                <CellRenderer
                  row={row}
                  column={primaryColumn}
                  resolvedValue={resolveValue(row, primaryColumn)}
                  displayMode="card"
                />
              </div>
            )
          ) : null}
        </div>

        {badgeColumns.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {badgeColumns.map((column) => (
              <CellRenderer
                key={String(column.key)}
                row={row}
                column={column}
                resolvedValue={resolveValue(row, column)}
                displayMode="card"
              />
            ))}
          </div>
        ) : null}
      </CardHeader>

      {metricColumns.length > 0 ? (
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-3 gap-2 border-t border-border/70 pt-3">
            {metricColumns.map((column) => (
              <div
                key={String(column.key)}
                title={column.title}
                className="min-w-0 rounded-[18px] border border-border/60 bg-muted/28 px-2 py-2.5"
              >
                <div className="mb-1 flex justify-center">
                  {React.createElement(getMetricIcon(column), {
                    "aria-hidden": true,
                    className: "size-3.5 text-primary/85",
                  })}
                  <span className="sr-only">{column.title}</span>
                </div>
                <div className="min-w-0 text-center">
                  <CellRenderer
                    row={row}
                    column={column}
                    resolvedValue={resolveValue(row, column)}
                    displayMode="card-compact"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function MobileCardSkeleton({ detailCount = 4 }: { detailCount?: number }) {
  const skeletonFields = Array.from({
    length: Math.max(4, Math.min(detailCount, 6)),
  });

  return (
    <Card className="gap-0 overflow-hidden rounded-[26px] border border-border/70 bg-card/98 shadow-lg shadow-black/[0.035]">
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="h-3 w-14 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 w-16 rounded-2xl bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-32 rounded-full bg-muted" />
            <div className="h-3 w-20 rounded-full bg-accent" />
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="h-6 w-18 rounded-full bg-muted" />
          <div className="h-6 w-14 rounded-full bg-muted" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-3 gap-2 border-t border-border/70 pt-3">
          {skeletonFields.map((_, index) => (
            <div
              key={`mobile-card-skeleton-${index}`}
              className="min-w-0 rounded-[18px] border border-border/60 bg-muted/28 px-2 py-2.5"
            >
              <div className="mx-auto mb-1 h-3.5 w-3.5 rounded-full bg-muted" />
              <div className="mx-auto h-4 w-10 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
