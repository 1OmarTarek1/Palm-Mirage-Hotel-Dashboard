'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Hotel,
  Search,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isFakeDarkMode, setIsFakeDarkMode] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.name || 'Guest User';
  const displayEmail = user?.email || 'guest@example.com';
  const displayAvatar =
    user?.avatarUrl ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${displayName}&backgroundColor=E5E7EB`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto h-full px-4 flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C6A969] to-[#B89555] flex items-center justify-center shadow-md">
            <Hotel className="w-5 h-5 text-[#FFFFFF]" />
          </div>
          <span className="font-semibold text-[#111827] tracking-tight text-[15px] sm:text-[16px]">
            Palm <span className="text-[#C6A969] font-bold">Mirage</span>
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div
            className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}
          >
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${searchFocused ? 'text-[#C6A969]' : 'text-[#6B7280]'}`}
            >
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-10 pl-9 pr-4 bg-[#F3F4F6] border border-[#E5E7EB] focus:border-[#C6A969]/60 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#C6A969]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all bg-white">
            <Globe className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsFakeDarkMode(!isFakeDarkMode)}
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all bg-white"
          >
            {isFakeDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button className="relative flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all bg-white group">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex w-4 h-4 items-center justify-center rounded-full bg-[#DC2626] text-[#FFFFFF] text-[9px] font-bold ring-2 ring-[#FFFFFF]">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-[#E5E7EB] hidden sm:block mx-1" />

          {/* ── Profile Dropdown ── */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center rounded-full focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] hover:border-[#C6A969] transition-all">
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FFFFFF]" />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E5E7EB]">
                  <p className="text-sm font-semibold text-[#111827] truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#6B7280] truncate">
                    {displayEmail}
                  </p>
                </div>
                <div className="py-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F3F4F6]"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:bg-[#F3F4F6]"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <div className="my-1.5 border-t border-[#E5E7EB]" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#DC2626]/10"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
