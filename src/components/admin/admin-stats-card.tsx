'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface AdminStatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    positive?: boolean;
    label?: string;
  };
  isLoading?: boolean;
  className?: string;
}

export function AdminStatsCard({
  label,
  value,
  icon,
  description,
  trend,
  isLoading = false,
  className,
}: AdminStatsCardProps) {
  return (
    <Card className={cn('rounded-xl border border-border/70 bg-card p-4 shadow-sm', className)}>
      <CardContent className="p-0 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-7 w-24 my-1 rounded" />
          ) : (
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
          )}

          {trend && !isLoading && (
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <span
                className={cn(
                  'font-semibold',
                  trend.positive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {trend.positive ? '+' : ''}
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-muted-foreground">{trend.label}</span>
              )}
            </div>
          )}

          {description && !trend && !isLoading && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
