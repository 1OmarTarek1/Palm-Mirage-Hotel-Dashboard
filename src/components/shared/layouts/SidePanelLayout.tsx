import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SidePanelLayoutProps {
  main: ReactNode;
  aside: ReactNode;
  className?: string;
  mainClassName?: string;
  asideClassName?: string;
}

export default function SidePanelLayout({
  main,
  aside,
  className,
  mainClassName,
  asideClassName,
}: SidePanelLayoutProps) {
  return (
    <section
      className={cn(
        "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start",
        className
      )}
    >
      <div className={cn("min-w-0 xl:w-full xl:max-w-[1180px] xl:justify-self-center", mainClassName)}>
        {main}
      </div>
      <aside className={cn("min-w-0 xl:w-full xl:max-w-[320px]", asideClassName)}>{aside}</aside>
    </section>
  );
}
