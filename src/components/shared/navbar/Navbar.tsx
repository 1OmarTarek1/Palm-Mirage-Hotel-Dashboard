'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Hotel,
  Globe,
  Sun,
  Moon,
  ArrowLeft,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
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

// ── Component ────────────────────────────────────────────────────────────────
export default function Navbar({
  user,
  notificationCount = 0,
  onSignOut,
}: NavbarProps) {
  const pathname = usePathname();

  // ── States ──
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // ── States for Toggles (UI only for now) ──
  const [isFakeDarkMode, setIsFakeDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  // ── Refs ──
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setLangDropdownOpen(false);
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
<div className="max-w-screen-2xl mx-auto h-full px-4 md:px-8 lg:px-12 flex items-center justify-between gap-2">        {/* ── Mobile Search View ── */}
        {mobileSearchOpen ? (
          <div className="flex items-center w-full h-full gap-2 animate-in fade-in zoom-in-95 duration-200 md:hidden">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="search"
              autoFocus
              placeholder="Search..."
              className="flex-1 h-10 px-4 bg-[#F3F4F6] border border-[#C6A969]/50 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#C6A969]/20"
            />
          </div>
        ) : (
          /* ── Normal Navbar View ── */
          <>
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

            {/* ── Search (Desktop) ── */}
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <div
                className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}
              >
                <span
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-[#C6A969]' : 'text-[#6B7280]'}`}
                >
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="search"
                  placeholder="Search..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full h-10 pl-9 pr-4 bg-[#F3F4F6] border border-[#E5E7EB] focus:border-[#C6A969]/60 rounded-full text-sm text-[#111827] placeholder-[#6B7280] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#C6A969]/20"
                />
              </div>
            </div>

            {/* ── Right Actions Cluster ── */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Icon (الآن مطابق لباقي الأزرار تماماً) */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all duration-200 bg-white"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* زرار اللغة (الكمبيوتر) */}
              <div className="relative hidden sm:block" ref={langDropdownRef}>
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all duration-200 bg-white"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-28 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="py-1.5 flex flex-col">
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setLangDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm text-left transition-colors ${language === 'en' ? 'text-[#C6A969] bg-[#F3F4F6]' : 'text-[#111827] hover:bg-[#F3F4F6] hover:text-[#C6A969]'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('ar');
                          setLangDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm text-left transition-colors ${language === 'ar' ? 'text-[#C6A969] bg-[#F3F4F6]' : 'text-[#111827] hover:bg-[#F3F4F6] hover:text-[#C6A969]'}`}
                        style={{ fontFamily: 'Arial, sans-serif' }}
                      >
                        العربية
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* زرار الدارك مود (الكمبيوتر) */}
              <button
                onClick={() => setIsFakeDarkMode(!isFakeDarkMode)}
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all duration-200 bg-white"
              >
                {isFakeDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <button className="relative flex w-10 h-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#C6A969] hover:border-[#C6A969] transition-all duration-200 bg-white group">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex w-4 h-4 items-center justify-center rounded-full bg-[#DC2626] text-[#FFFFFF] text-[9px] font-bold ring-2 ring-[#FFFFFF] group-hover:scale-110 transition-transform duration-150">
                    {notificationCount > 99 ? '+99' : notificationCount}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-[#E5E7EB] hidden sm:block mx-1" />

              {/* ── Profile Dropdown ── */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center rounded-full transition-all duration-150 focus:outline-none"
                >
                  {/* 👈 تم توحيد مقاس الصورة لـ w-10 h-10 واستخدام إطار بدل الحلقة الخارجية */}
                  <div className="relative w-10 h-10 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] hover:border-[#C6A969] transition-all duration-200">
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#FFFFFF]" />
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
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
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100 ${pathname === '/profile' ? 'bg-[#C6A969]/10 text-[#C6A969]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'}`}
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100 ${pathname === '/settings' ? 'bg-[#C6A969]/10 text-[#C6A969]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'}`}
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>

                      {/* ── Mobile Toggles ── */}
                      <div className="sm:hidden block">
                        <div className="my-1.5 border-t border-[#E5E7EB]" />

                        <div className="flex items-center justify-between px-4 py-2">
                          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                            {isFakeDarkMode ? (
                              <Sun className="w-4 h-4" />
                            ) : (
                              <Moon className="w-4 h-4" />
                            )}
                            <span>
                              {isFakeDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFakeDarkMode(!isFakeDarkMode);
                            }}
                            className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${isFakeDarkMode ? 'bg-[#C6A969]' : 'bg-[#E5E7EB]'}`}
                          >
                            <span
                              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isFakeDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-4 py-2">
                          <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                            <Globe className="w-4 h-4" />
                            <span>Language</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLanguage(language === 'en' ? 'ar' : 'en');
                            }}
                            className="flex items-center bg-[#F3F4F6] border border-[#E5E7EB] rounded-full p-0.5 relative w-[4.5rem] h-7 focus:outline-none"
                          >
                            <div
                              className={`absolute top-0.5 bottom-0.5 w-[2.1rem] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${language === 'ar' ? 'translate-x-[2.1rem]' : 'translate-x-0'}`}
                            />
                            <span
                              className={`relative w-1/2 text-center text-[10px] font-bold z-10 transition-colors duration-300 ${language === 'en' ? 'text-[#C6A969]' : 'text-[#9CA3AF]'}`}
                            >
                              EN
                            </span>
                            <span
                              className={`relative w-1/2 text-center text-[10px] font-bold z-10 transition-colors duration-300 ${language === 'ar' ? 'text-[#C6A969]' : 'text-[#9CA3AF]'}`}
                            >
                              AR
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="my-1.5 border-t border-[#E5E7EB]" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onSignOut) onSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-100 text-[#DC2626] hover:bg-[#DC2626]/10"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
