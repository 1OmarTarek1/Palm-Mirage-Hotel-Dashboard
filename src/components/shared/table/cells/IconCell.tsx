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

export default function IconCell({ resolvedValue }: CellProps) {
  const iconKey = String(resolvedValue);
  const icon = IconMap[iconKey] || null;
  return (
    <div className="flex justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-muted text-primary shadow-sm">
        {icon}
      </div>
    </div>
  );
}
