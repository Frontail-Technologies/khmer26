'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface AdminTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function AdminTableSkeleton({
  columns = 5,
  rows = 5,
}: AdminTableSkeletonProps) {
  return (
    <div className="rounded-xl border border-border/70 overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-border/60 hover:bg-transparent">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="h-10 px-4">
                <Skeleton className="h-4 w-20 rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-border/40">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="p-4">
                  <Skeleton
                    className={`h-4 rounded ${
                      colIndex === 0
                        ? 'w-32'
                        : colIndex === columns - 1
                        ? 'w-16 ml-auto'
                        : 'w-24'
                    }`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
