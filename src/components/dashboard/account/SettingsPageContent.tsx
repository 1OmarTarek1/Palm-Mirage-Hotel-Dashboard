"use client";

import { Globe, MoonStar, ShieldCheck, BellRing } from "lucide-react";

import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import SubHeader from "@/components/shared/header/SubHeader";

export default function SettingsPageContent() {
  return (
    <DashboardPageShell>
      <SubHeader
        title="Settings"
        description="Dashboard preferences. Theme and language can be changed from the top bar."
      />
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Appearance
          </p>
          <h3 className="mt-2 font-header text-lg font-semibold text-foreground">
            Theme mode
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the moon/sun button in the navbar to switch between dark and light mode.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground">
            <MoonStar className="h-3.5 w-3.5 text-primary" />
            Controlled from top bar
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Localization
          </p>
          <h3 className="mt-2 font-header text-lg font-semibold text-foreground">
            Language
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Switch dashboard language from the globe icon in the navbar.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground">
            <Globe className="h-3.5 w-3.5 text-primary" />
            English / Arabic
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Notifications
          </p>
          <h3 className="mt-2 font-header text-lg font-semibold text-foreground">
            Attention rail behavior
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Operational alerts stay visible until the related booking/payment status is actually resolved.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground">
            <BellRing className="h-3.5 w-3.5 text-primary" />
            State-driven alerts
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Security
          </p>
          <h3 className="mt-2 font-header text-lg font-semibold text-foreground">
            Session protection
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Access is bound to your authenticated admin session. Use the profile menu to sign out safely.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Admin auth required
          </p>
        </div>
      </div>
    </DashboardPageShell>
  );
}
