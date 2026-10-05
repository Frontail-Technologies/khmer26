'use client';

import type { ReactNode } from 'react';
import { Tray } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function AdminEmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border/80 rounded-2xl bg-muted/5',
        className
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-muted/40 text-muted-foreground flex items-center justify-center mb-3">
        {icon || <Tray size={24} />}
      </div>
      <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-4 h-8 text-xs font-semibold rounded-lg"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
