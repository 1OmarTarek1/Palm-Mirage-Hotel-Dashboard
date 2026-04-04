import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "primary",
}: StatCardProps) {
  const colorMap: Record<string, string> = {
    primary: "from-primary/20 to-primary/5 border-primary/20 text-primary",
    secondary: "from-secondary/20 to-secondary/5 border-secondary/20 text-secondary",
    destructive: "from-destructive/20 to-destructive/5 border-destructive/20 text-destructive",
    muted: "from-muted/20 to-muted/5 border-muted/20 text-muted-foreground",
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-3 transition-all hover:-translate-y-1 hover:shadow-lg md:p-3.5 ${selectedColor}`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-main text-[11px] font-medium text-muted-foreground opacity-80 md:text-xs">
            {title}
          </p>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background/50 shadow-sm ring-1 ring-border backdrop-blur-sm md:h-8 md:w-8">
            <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
        </div>

        <div>
          <h3 className="font-header mt-0.5 text-xl font-bold tracking-tight md:text-2xl">{value}</h3>

          {trend ? (
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`font-main text-[11px] font-semibold ${trend.isUp ? "text-emerald-500" : "text-rose-500"}`}
              >
                {trend.isUp ? "↑" : "↓"} {trend.value}
              </span>
              <span className="font-main text-[11px] text-muted-foreground">vs last month</span>
            </div>
          ) : null}

          {description && !trend ? (
            <p className="font-main mt-1 text-[11px] text-muted-foreground md:text-xs">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-current opacity-5 blur-2xl" />
    </div>
  );
}
