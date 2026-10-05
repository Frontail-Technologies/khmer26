'use client';

import { WarningCircle, ArrowsClockwise } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminErrorStateProps {
  title?: string;
  message?: string;
  requestId?: string;
  onRetry?: () => void;
  className?: string;
}

export function AdminErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching information from the server.',
  requestId,
  onRetry,
  className,
}: AdminErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-destructive/20 rounded-2xl bg-destructive/5',
        className
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-3">
        <WarningCircle size={24} />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
        {message}
      </p>
      {requestId && (
        <span className="text-[10px] text-muted-foreground/70 font-mono mt-2 bg-muted px-2 py-0.5 rounded">
          Req ID: {requestId}
        </span>
      )}
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 h-8 px-3 text-xs font-semibold rounded-lg border-border"
        >
          <ArrowsClockwise size={14} className="mr-1.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
