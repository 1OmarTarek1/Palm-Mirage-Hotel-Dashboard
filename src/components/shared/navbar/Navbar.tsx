'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hotel } from 'lucide-react';

export interface UserData {
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

interface NavbarProps {
  user: UserData | null;
  notificationCount?: number;
  onSignOut?: () => void;
}

export default function Navbar({
  user,
  notificationCount = 0,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto h-full px-4 flex items-center justify-between gap-2">
        {/* ── Logo ── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C6A969] to-[#B89555] flex items-center justify-center shadow-md transition-shadow duration-300">
            <Hotel className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="font-semibold text-[#111827] tracking-tight text-[15px] sm:text-[16px] transition-colors whitespace-nowrap">
            Palm <span className="text-[#C6A969] font-bold">Mirage</span>
          </span>
        </Link>

        {/* باقي العناصر هتتضاف في الخطوات الجاية */}
        <div className="flex-1" />
      </div>
    </header>
  );
}
