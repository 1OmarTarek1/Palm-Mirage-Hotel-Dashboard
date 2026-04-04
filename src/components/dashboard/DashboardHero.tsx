import { CheckCircle2 } from "lucide-react";

interface DashboardHeroProps {
  lastUpdated: string;
  paymentsFocus: string;
}

export default function DashboardHero({
  lastUpdated,
  paymentsFocus,
}: DashboardHeroProps) {
  return (
    <header className="relative overflow-hidden rounded-[26px] border border-primary/20 bg-card p-4 shadow-sm md:p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary)_0%,var(--secondary)_100%)]" />
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">
            <CheckCircle2 className="h-3 w-3" />
            Palm Mirage operations
          </div>

          <div className="space-y-1.5">
            <h2 className="font-header text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hotel overview
            </h2>
            <p className="max-w-2xl font-main text-sm leading-5 text-muted-foreground">
              A clean daily control center for occupancy, guest movement, payments, and activity
              pressure across the property.
            </p>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 xl:w-[24rem]">
          <div className="rounded-[20px] border border-primary/15 bg-primary/5 p-3.5">
            <p className="font-main text-[11px] uppercase tracking-[0.16em] text-primary/80">
              Last sync
            </p>
            <p className="mt-1.5 font-header text-base font-semibold text-foreground">{lastUpdated}</p>
          </div>

          <div className="rounded-[20px] border border-secondary/20 bg-secondary/8 p-3.5">
            <p className="font-main text-[11px] uppercase tracking-[0.16em] text-secondary">
              Follow-up focus
            </p>
            <p className="mt-1.5 font-main text-sm leading-5 text-foreground">{paymentsFocus}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
