"use client";

import DashboardPageShell from "@/components/shared/layouts/DashboardPageShell";
import SubHeader from "@/components/shared/header/SubHeader";

export default function SettingsPageContent() {
  return (
    <DashboardPageShell>
      <SubHeader
        title="Settings"
        description="Dashboard preferences. Theme and language can be changed from the top bar."
      />
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm md:p-8">
        <p>
          Additional account and application settings can be added here as your admin features
          grow.
        </p>
      </div>
    </DashboardPageShell>
  );
}
