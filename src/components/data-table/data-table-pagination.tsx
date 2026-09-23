import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type { DataTablePaginationProps } from "./types"

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount() || 1
  const pageSize = table.getState().pagination.pageSize
  const rowCount = table.getFilteredRowModel().rows.length

  const pageSizeSelectOptions = pageSizeOptions.map((size) => ({
    value: `${size}`,
    label: `${size}`,
  }))

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3">
      <div className="text-xs text-muted-foreground">
        Showing <strong>{rowCount === 0 ? 0 : pageIndex * pageSize + 1}</strong> to{" "}
        <strong>{Math.min((pageIndex + 1) * pageSize, rowCount)}</strong> of{" "}
        <strong>{rowCount}</strong> results
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page</span>
          <Select
            value={`${pageSize}`}
            items={pageSizeSelectOptions}
            onValueChange={(val) => {
              if (val) table.setPageSize(Number(val))
            }}
          >
            <SelectTrigger className="h-8 w-18 text-xs bg-background rounded-lg border-input">
              <SelectValue>
                {(val) => getSelectOptionLabel(pageSizeSelectOptions, val, `${pageSize}`)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent side="top" className="rounded-lg shadow-md">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={`${size}`} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs font-semibold text-foreground whitespace-nowrap">
          Page {pageIndex + 1} of {pageCount}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="First page"
          >
            <CaretDoubleLeft size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <CaretLeft size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <CaretRight size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Last page"
          >
            <CaretDoubleRight size={13} weight="bold" />
          </Button>
        </div>
      </div>
    </div>
  )
}
