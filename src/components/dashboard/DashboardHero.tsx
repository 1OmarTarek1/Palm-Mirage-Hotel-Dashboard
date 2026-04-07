import { CheckCircle2 } from "lucide-react";

/** Static above-the-fold hero — kept free of data fetches so LCP text can paint immediately. */
export default function DashboardHero() {
  return (
    <header className="relative overflow-hidden rounded-[22px] border border-primary/20 bg-card p-3.5 shadow-sm md:p-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary)_0%,var(--secondary)_100%)]" />
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative">
        <div className="space-y-2.5">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Palm Mirage operations
          </div>

          <div className="space-y-1">
            <h2 className="font-header text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Hotel overview
            </h2>
            <p className="max-w-2xl font-main text-xs leading-5 text-muted-foreground md:text-sm">
              A clean daily control center for occupancy, guest movement, payments, and activity
              pressure across the property.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
