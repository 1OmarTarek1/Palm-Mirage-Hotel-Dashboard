'use client';

import React from 'react';
import { Plus, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function SubHeader({
  title,
  description,
  actionLabel = 'Add', // 👈 1. حطينا الكلمة الافتراضية هنا
  onAction,
  actionIcon: ActionIcon = Plus, 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-[#E5E7EB] dark:border-[#374151] transition-colors duration-300">
      
      {/* ── الجزء اللي على الشمال: العنوان والوصف ── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-[#111827] dark:text-[#F8F9FA] tracking-tight transition-colors duration-300">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-base text-[#6B7280] dark:text-[#9CA3AF] transition-colors duration-300">
            {description}
          </p>
        )}
      </div>

      {/* ── الجزء اللي على اليمين: زر الإجراء الرئيسي ── */}
      {/* 👈 2. خلينا الشرط onAction عشان الزرار يظهر بس لو بعتناله وظيفة */}
      {onAction && (
        <div className="shrink-0">
          <Button
            onClick={onAction}
            className={cn(
              "group flex items-center justify-center gap-2.5 rounded-xl px-6 h-auto py-3.5 text-base font-semibold shadow-md transition-all duration-300 border-none",
              "bg-gradient-to-br from-[#C6A969] to-[#B89555] text-[#FFFFFF]",
              "hover:scale-[1.02] hover:from-[#B89555] hover:to-[#A6813F]"
            )}
          >
            {ActionIcon && (
              <ActionIcon className="w-5 h-5 text-[#FFFFFF]" />
            )}
            <span className="tracking-tight">{actionLabel}</span>
          </Button>
        </div>
      )}
      
    </div>
  );
}