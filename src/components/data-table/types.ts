import type { ColumnDef, Table } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  searchKey?: string
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  className?: string
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: import("@tanstack/react-table").Column<TData, TValue>
  title: string
  className?: string
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  searchPlaceholder?: string
}
