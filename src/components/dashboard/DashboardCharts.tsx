"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables, type ChartData, type ChartOptions } from "chart.js";

Chart.register(...registerables);

export default function DashboardCharts({
  occupancyData,
  bookingStatusData,
  trendData,
}: {
  occupancyData: ChartData<"doughnut", number[], string>;
  bookingStatusData: ChartData<"bar", number[], string>;
  trendData: ChartData<"line", number[], string>;
}) {
  const occupancyRef = useRef<HTMLCanvasElement>(null);
  const bookingStatusRef = useRef<HTMLCanvasElement>(null);
  const trendRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let occupancyChart: Chart | null = null;
    let bookingStatusChart: Chart | null = null;
    let trendChart: Chart | null = null;

    const rootStyles = getComputedStyle(document.documentElement);
    const mainFont = rootStyles.getPropertyValue("--font-main").trim() || "sans-serif";

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "rgba(156, 163, 175, 0.8)",
            font: { size: 12, family: mainFont },
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    };

    const occupancyOptions: ChartOptions<"doughnut"> = {
      ...commonOptions,
      cutout: "70%",
      plugins: {
        ...commonOptions.plugins,
        title: { display: false },
      },
    };

    const bookingStatusOptions: ChartOptions<"bar"> = {
      ...commonOptions,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(156, 163, 175, 0.1)" },
          ticks: { color: "rgba(156, 163, 175, 0.8)", font: { family: mainFont } },
        },
        x: {
          grid: { display: false },
          ticks: { color: "rgba(156, 163, 175, 0.8)", font: { family: mainFont } },
        },
      },
    };

    const trendOptions: ChartOptions<"line"> = {
      ...commonOptions,
      elements: {
        line: { tension: 0.4 },
        point: { radius: 4, hoverRadius: 6 },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(156, 163, 175, 0.1)" },
          ticks: { color: "rgba(156, 163, 175, 0.8)", font: { family: mainFont } },
        },
        x: {
          grid: { display: false },
          ticks: { color: "rgba(156, 163, 175, 0.8)", font: { family: mainFont } },
        },
      },
    };

    if (occupancyRef.current) {
      occupancyChart = new Chart(occupancyRef.current, {
        type: "doughnut",
        data: occupancyData,
        options: occupancyOptions,
      });
    }

    if (bookingStatusRef.current) {
      bookingStatusChart = new Chart(bookingStatusRef.current, {
        type: "bar",
        data: bookingStatusData,
        options: bookingStatusOptions,
      });
    }

    if (trendRef.current) {
      trendChart = new Chart(trendRef.current, {
        type: "line",
        data: trendData,
        options: trendOptions,
      });
    }

    return () => {
      occupancyChart?.destroy();
      bookingStatusChart?.destroy();
      trendChart?.destroy();
    };
  }, [occupancyData, bookingStatusData, trendData]);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="min-w-[350px] flex-1 rounded-xl border bg-card p-3.5 shadow-sm md:p-4">
        <h4 className="mb-1 font-header text-sm font-semibold md:text-base">Room Occupancy</h4>
        <p className="mb-3 font-main text-[11px] text-muted-foreground md:text-xs">
          Current split between occupied inventory and ready-to-sell rooms.
        </p>
        <div className="relative h-[210px] md:h-[230px]">
          <canvas ref={occupancyRef} />
        </div>
      </div>

      <div className="min-w-[350px] flex-1 rounded-xl border bg-card p-3.5 shadow-sm md:p-4">
        <h4 className="mb-1 font-header text-sm font-semibold md:text-base">Reservation Status Mix</h4>
        <p className="mb-3 font-main text-[11px] text-muted-foreground md:text-xs">
          See where the reservations pipeline is getting stuck or flowing well.
        </p>
        <div className="relative h-[210px] md:h-[230px]">
          <canvas ref={bookingStatusRef} />
        </div>
      </div>

      <div className="min-w-[350px] flex-1 rounded-xl border bg-card p-3.5 shadow-sm md:p-4">
        <h4 className="mb-1 font-header text-sm font-semibold md:text-base">Weekly Revenue Trend</h4>
        <p className="mb-3 font-main text-[11px] text-muted-foreground md:text-xs">
          Combined room and activity booking value over the last 7 days.
        </p>
        <div className="relative h-[210px] md:h-[230px]">
          <canvas ref={trendRef} />
        </div>
      </div>
    </div>
  );
}
