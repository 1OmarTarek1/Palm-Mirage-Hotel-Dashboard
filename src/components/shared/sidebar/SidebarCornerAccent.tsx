import { cn } from "@/lib/utils";

interface SidebarCornerAccentProps {
  className?: string;
}

export default function SidebarCornerAccent({
  className,
}: SidebarCornerAccentProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-[-1px] top-[4.5rem] z-[155] hidden h-8 w-5 translate-x-[calc(100%-1px)] overflow-hidden md:block",
        className
      )}
    >
      <div className="absolute bottom-0 left-[-2px] right-[2px] top-[-1px] rounded-[20px] rounded-tl-none bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))]" />
      <div className="absolute inset-0 rounded-tl-[20px] border-l border-t border-transparent bg-background" />
    </div>
  );
}
