import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardSectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardSectionCard({
  children,
  className,
}: DashboardSectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[32px] bg-card p-4 pt-0 pb-5 shadow-2xl shadow-black/5 ring-1 ring-border transition-colors duration-300",
        className
      )}
    >
      {children}
    </section>
  );
}
