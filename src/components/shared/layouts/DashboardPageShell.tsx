"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DashboardPageShellProps {
  children: ReactNode;
  className?: string;
}

export default function DashboardPageShell({
  children,
  className,
}: DashboardPageShellProps) {
  return <div className={cn("mx-auto w-full max-w-[1720px]", className)}>{children}</div>;
}
