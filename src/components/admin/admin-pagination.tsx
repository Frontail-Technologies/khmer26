'use client';

import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface AdminPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

export function AdminPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
  disabled = false,
}: AdminPaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3">
      <div className="text-xs text-muted-foreground order-2 sm:order-1">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{' '}
        <span className="font-semibold text-foreground">{endItem}</span> of{' '}
        <span className="font-semibold text-foreground">{total.toLocaleString()}</span> entries
      </div>

      <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        {onLimitChange && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Rows per page</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-16 text-xs bg-background">
                <SelectValue placeholder={String(limit)} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((opt) => (
                  <SelectItem key={opt} value={String(opt)} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || disabled}
            className="h-8 w-8 rounded-lg"
            aria-label="Previous Page"
          >
            <CaretLeft size={14} />
          </Button>

          <span className="text-xs font-semibold px-2">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || disabled}
            className="h-8 w-8 rounded-lg"
            aria-label="Next Page"
          >
            <CaretRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
