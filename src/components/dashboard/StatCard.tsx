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
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${selectedColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground opacity-80">{title}</p>
          <h3 className="mt-1 text-3xl font-bold tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-xs font-semibold ${trend.isUp ? "text-emerald-500" : "text-rose-500"}`}>
                {trend.isUp ? "↑" : "↓"} {trend.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          
          {description && !trend && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm shadow-sm ring-1 ring-border">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-current opacity-5 blur-2xl" />
    </div>
  );
}
