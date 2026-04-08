"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavbarBrand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 md:hidden">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm">
        <Image
          src="/logo.png"
          alt="Palm Mirage Logo"
          fill
          sizes="40px"
          quality={70}
          priority
          className="object-contain p-1.5"
        />
      </div>
      <div className="leading-tight">
        <span className="font-header block text-sm font-semibold tracking-tight text-primary">
          Palm Mirage
        </span>
        <span className="font-main block text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
          Luxury Hotel
        </span>
      </div>
    </Link>
  );
}
