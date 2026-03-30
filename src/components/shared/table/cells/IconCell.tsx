import React from "react";
import { Ship, Landmark, Mountain, Palette, CloudSun, ChefHat } from "lucide-react";
import { CellProps } from "./types";

const IconMap: Record<string, React.ReactNode> = {
  Ship: <Ship size={18} />,
  Landmark: <Landmark size={18} />,
  Mountain: <Mountain size={18} />,
  Palette: <Palette size={18} />,
  CloudSun: <CloudSun size={18} />,
  ChefHat: <ChefHat size={18} />,
};

export default function IconCell({ resolvedValue, displayMode = "table" }: CellProps) {
  const iconKey = String(resolvedValue);
  const icon = IconMap[iconKey] || null;
  return (
    <div className={`flex ${displayMode === "card" ? "justify-start" : "justify-center"}`}>
      <div
        className={`flex items-center justify-center rounded-2xl border border-border bg-muted text-primary shadow-sm ${
          displayMode === "card-compact" ? "h-8 w-8" : "h-10 w-10"
        }`}
      >
        {icon}
      </div>
    </div>
  );
}
