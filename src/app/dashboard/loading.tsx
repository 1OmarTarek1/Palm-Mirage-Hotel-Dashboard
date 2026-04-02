"use client";

import React from "react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Global Dashboard Loading State
 * This component will be shown automatically by Next.js for any page loading
 * within the /dashboard route. It provides a consistent, premium branding
 * experience during transitions.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Animated Pulse Rings */}
        <div className="absolute h-32 w-32 animate-[ping_2s_infinite] rounded-full bg-primary/5" />
        <div className="absolute h-24 w-24 animate-[ping_1.5s_infinite] rounded-full bg-primary/10" />
        <div className="absolute h-16 w-16 animate-[ping_1s_infinite] rounded-full bg-primary/20" />
        
        {/* Central Spinner Container */}
        <div className="relative flex items-center justify-center rounded-full bg-card p-6 shadow-2xl ring-1 ring-border/50">
          <Spinner className="h-12 w-12 text-primary" />
          
          {/* Subtle Glow Effect */}
          <div className="absolute -inset-1 animate-pulse rounded-full bg-primary/20 blur-md" />
        </div>
      </div>

      {/* Loading Status Text */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Palm Mirage
        </h2>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <p className="text-sm font-medium text-muted-foreground">
            Synchronizing with server...
          </p>
        </div>
      </div>

      {/* Decorative Progress Hint */}
      <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-muted/30">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  );
}
