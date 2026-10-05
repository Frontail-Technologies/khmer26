'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'approved'
  | 'pending_review'
  | 'pending'
  | 'rejected'
  | 'suspended'
  | 'banned'
  | 'sold'
  | 'expired'
  | 'draft'
  | 'verified'
  | 'unverified'
  | 'reviewing'
  | 'resolved'
  | 'dismissed'
  | 'completed'
  | 'failed'
  | 'countered'
  | 'withdrawn'
  | 'successful'
  | 'visible'
  | 'hidden'
  | 'queued'
  | 'processing'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  verified: {
    label: 'Verified',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },

  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  pending_review: {
    label: 'Pending Review',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  reviewing: {
    label: 'Under Review',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  countered: {
    label: 'Countered',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },

  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  banned: {
    label: 'Banned',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  dismissed: {
    label: 'Dismissed',
    className: 'bg-muted text-muted-foreground border-border',
  },
  withdrawn: {
    label: 'Withdrawn',
    className: 'bg-muted text-muted-foreground border-border',
  },
  failed: {
    label: 'Failed',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },

  sold: {
    label: 'Sold',
    className: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
  },
  expired: {
    label: 'Expired',
    className: 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-400 border-neutral-500/20',
  },
  draft: {
    label: 'Draft',
    className: 'bg-muted text-muted-foreground border-border',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground border-border',
  },
  unverified: {
    label: 'Unverified',
    className: 'bg-muted text-muted-foreground border-border',
  },

  // Payment
  successful: {
    label: 'Successful',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },

  // Review visibility
  visible: {
    label: 'Visible',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  hidden: {
    label: 'Hidden',
    className: 'bg-muted text-muted-foreground border-border',
  },

  // Broadcast
  queued: {
    label: 'Queued',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const normalizedKey = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIG[normalizedKey] || {
    label: label || status || 'Unknown',
    className: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-semibold text-[11px] px-2 py-0.5 rounded-md border tracking-tight',
        config.className,
        className
      )}
    >
      {label || config.label}
    </Badge>
  );
}
