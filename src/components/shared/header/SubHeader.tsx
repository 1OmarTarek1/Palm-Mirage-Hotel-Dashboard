'use client';


import { Plus, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

//  Types 
interface PageHeaderProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  actionEvent?: string;
  actionIcon?: LucideIcon;
}

function formatPathTitle(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (!lastSegment) return 'Dashboard';

  if (/^\[.*\]$/.test(lastSegment)) {
    return 'Details';
  }

  return lastSegment
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

//  Component 
export default function SubHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  actionEvent,
  actionIcon: ActionIcon = Plus, 
}: PageHeaderProps) {
  const pathname = usePathname();
  const resolvedTitle = title ?? formatPathTitle(pathname);
  const shouldRenderAction = Boolean(actionLabel);

  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 transition-colors duration-300 sm:flex-row sm:items-end sm:justify-between">
      
      <div className="flex-1 min-w-0">
        <h1 className="font-header text-2xl font-bold tracking-tight text-primary transition-colors duration-300 md:text-[1.85rem]">
          {resolvedTitle}
        </h1>
        {description && (
          <p className="mt-1 font-main text-sm text-muted-foreground transition-colors duration-300 md:text-[15px]">
            {description}
          </p>
        )}
      </div>
    
      {shouldRenderAction && (
        <div className="shrink-0">
          {actionHref ? (
            <Button asChild variant="palmPrimary" className="group">
              <Link href={actionHref}>
                {ActionIcon ? <ActionIcon className="h-5 w-5 text-white" /> : null}
                <span className="tracking-tight">{actionLabel}</span>
              </Link>
            </Button>
          ) : actionEvent ? (
            <Button
              variant="palmPrimary"
              onClick={() => window.dispatchEvent(new Event(actionEvent))}
              className="group"
            >
              {ActionIcon ? <ActionIcon className="h-5 w-5 text-white" /> : null}
              <span className="tracking-tight">{actionLabel}</span>
            </Button>
          ) : (
            <Button
              variant="palmPrimary"
              onClick={onAction}
              disabled={!onAction}
              className={cn(
                "group",
                !onAction && "cursor-not-allowed opacity-60 hover:scale-100"
              )}
            >
              {ActionIcon ? <ActionIcon className="h-5 w-5 text-white" /> : null}
              <span className="tracking-tight">{actionLabel}</span>
            </Button>
          )}
        </div>
      )}
      
    </div>
  );
}
