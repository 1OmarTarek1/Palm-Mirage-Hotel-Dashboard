"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables, type ChartData } from "chart.js";

Chart.register(...registerables);

export default function DashboardCharts({
  occupancyData,
  userData,
  trendData,
}: {
  occupancyData: ChartData<"doughnut", number[], string>;
  userData: ChartData<"bar", number[], string>;
  trendData: ChartData<"line", number[], string>;
}) {
  const occupancyRef = useRef<HTMLCanvasElement>(null);
  const userRef = useRef<HTMLCanvasElement>(null);
  const trendRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let occupancyChart: Chart | null = null;
    let userChart: Chart | null = null;
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

    if (occupancyRef.current) {
      occupancyChart = new Chart(occupancyRef.current, {
        type: "doughnut",
        data: occupancyData,
        options: {
          ...commonOptions,
          cutout: "70%",
          plugins: {
            ...commonOptions.plugins,
            title: { display: false },
          },
        },
      });
    }

    if (userRef.current) {
      userChart = new Chart(userRef.current, {
        type: "bar",
        data: userData,
        options: {
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
        },
      });
    }

    if (trendRef.current) {
      trendChart = new Chart(trendRef.current, {
        type: "line",
        data: trendData,
        options: {
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
        },
      });
    }

    return () => {
      occupancyChart?.destroy();
      userChart?.destroy();
      trendChart?.destroy();
    };
  }, [occupancyData, userData, trendData]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h4 className="mb-6 font-header text-lg font-semibold">Room Occupancy</h4>
        <div className="relative h-[300px]">
          <canvas ref={occupancyRef} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
        <h4 className="mb-6 font-header text-lg font-semibold">User Roles Distribution</h4>
        <div className="relative h-[300px]">
          <canvas ref={userRef} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
        <h4 className="mb-6 font-header text-lg font-semibold">Weekly Activity Trends</h4>
        <div className="relative h-[300px]">
          <canvas ref={trendRef} />
        </div>
      </div>
    </div>
  );
}
