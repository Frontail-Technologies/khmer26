'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { CaretUp, CaretDown, CaretUpDown } from '@phosphor-icons/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminTableSkeleton } from './admin-table-skeleton';
import { AdminEmptyState } from './admin-empty-state';
import { AdminErrorState } from './admin-error-state';
import { AdminPagination } from './admin-pagination';
import { cn } from '@/lib/utils';

export interface AdminDataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  isFetching?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  toolbar?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
  className?: string;
}

export function AdminDataTable<TData>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  error = null,
  onRetry,
  toolbar,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the selected filters.',
  onClearFilters,
  sortField,
  sortOrder,
  onSortChange,
  pagination,
  className,
}: AdminDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        {toolbar}
        <AdminErrorState
          message={error.message || 'Failed to load records from server'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {toolbar}

      <div className="relative rounded-xl border border-border/70 overflow-hidden bg-card shadow-sm">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden z-10">
            <div className="h-full bg-primary animate-pulse w-1/3" />
          </div>
        )}

        <div className="overflow-x-auto">
          {isLoading ? (
            <AdminTableSkeleton columns={columns.length} rows={pagination?.limit || 5} />
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-border/60 hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort() || Boolean(header.column.columnDef.enableSorting);
                      const columnId = header.column.id;
                      const isSorted = sortField === columnId;

                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            'h-10 px-4 text-xs font-semibold text-muted-foreground select-none whitespace-nowrap',
                            canSort && onSortChange && 'cursor-pointer hover:text-foreground transition-colors'
                          )}
                          onClick={() => {
                            if (canSort && onSortChange) {
                              onSortChange(columnId);
                            }
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center gap-1.5">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {canSort && onSortChange && (
                                <span className="text-muted-foreground/70">
                                  {isSorted ? (
                                    sortOrder === 'asc' ? (
                                      <CaretUp size={12} className="text-foreground" />
                                    ) : (
                                      <CaretDown size={12} className="text-foreground" />
                                    )
                                  ) : (
                                    <CaretUpDown size={12} />
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-border/40 hover:bg-muted/30 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-4 text-xs">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-48 text-center p-0"
                    >
                      <AdminEmptyState
                        title={emptyTitle}
                        description={emptyDescription}
                        actionLabel={onClearFilters ? 'Clear filters' : undefined}
                        onAction={onClearFilters}
                        className="border-0 rounded-none bg-transparent"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {pagination && pagination.total > 0 && !isLoading && (
          <div className="border-t border-border/60 bg-muted/10">
            <AdminPagination
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
              onLimitChange={pagination.onLimitChange}
              disabled={isFetching}
            />
          </div>
        )}
      </div>
    </div>
  );
}
