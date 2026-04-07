export default function SidebarTooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[160] hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-primary/20 bg-card px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-primary shadow-xl group-hover:block">
      {label}
    </div>
  );
}
