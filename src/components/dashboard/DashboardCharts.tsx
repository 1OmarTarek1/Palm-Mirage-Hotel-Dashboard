"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ChartProps {
  data: any;
  title: string;
}

export default function DashboardCharts({ occupancyData, userData, trendData }: {
  occupancyData: any;
  userData: any;
  trendData: any;
}) {
  const occupancyRef = useRef<HTMLCanvasElement>(null);
  const userRef = useRef<HTMLCanvasElement>(null);
  const trendRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let occupancyChart: Chart | null = null;
    let userChart: Chart | null = null;
    let trendChart: Chart | null = null;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: "rgba(156, 163, 175, 0.8)",
            font: { size: 12 },
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
              ticks: { color: "rgba(156, 163, 175, 0.8)" },
            },
            x: {
              grid: { display: false },
              ticks: { color: "rgba(156, 163, 175, 0.8)" },
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
              ticks: { color: "rgba(156, 163, 175, 0.8)" },
            },
            x: {
              grid: { display: false },
              ticks: { color: "rgba(156, 163, 175, 0.8)" },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Occupancy Chart */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-6">Room Occupancy</h4>
        <div className="h-[300px] relative">
          <canvas ref={occupancyRef} />
        </div>
      </div>

      {/* User Roles Chart */}
      <div className="bg-card border rounded-xl p-6 shadow-sm lg:col-span-1">
        <h4 className="text-lg font-semibold mb-6">User Roles Distribution</h4>
        <div className="h-[300px] relative">
          <canvas ref={userRef} />
        </div>
      </div>

      {/* Activity Trends Chart */}
      <div className="bg-card border rounded-xl p-6 shadow-sm lg:col-span-1">
        <h4 className="text-lg font-semibold mb-6">Weekly Activity Trends</h4>
        <div className="h-[300px] relative">
          <canvas ref={trendRef} />
        </div>
      </div>
    </div>
  );
}
