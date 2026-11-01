import { useTranslations } from "next-intl"
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
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount() || 1
  const pageSize = table.getState().pagination.pageSize
  const rowCount = table.getFilteredRowModel().rows.length

  const pageSizeSelectOptions = pageSizeOptions.map((size) => ({
    value: `${size}`,
    label: `${size}`,
  }))

  // A single page needs no footer at all.
  if (rowCount <= (pageSizeOptions[0] ?? pageSize) && pageCount <= 1) return null

  const start = rowCount === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, rowCount)
  const navButton = "h-9 w-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer md:h-8 md:w-8 md:rounded-lg"

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 px-1 py-2 sm:px-2">
      <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
        <span>
          <span className="font-semibold text-foreground">{start}–{end}</span> / {rowCount}
        </span>
        <div className="hidden items-center md:flex">
          <Select
            value={`${pageSize}`}
            items={pageSizeSelectOptions}
            onValueChange={(val) => {
              if (val) table.setPageSize(Number(val))
            }}
          >
            <SelectTrigger aria-label={tGenerated("rowsPerPage")} className="h-8 w-18 rounded-lg border-input bg-background px-2 text-xs">
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
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className={`${navButton} hidden md:inline-flex`}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label={tGenerated("firstPage")}
        >
          <CaretDoubleLeft size={13} weight="bold" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={navButton}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label={tGenerated("previousPage")}
        >
          <CaretLeft size={14} weight="bold" />
        </Button>
        <span className="min-w-12 text-center text-xs font-semibold text-foreground tabular-nums" aria-label={tDynamic("pageOf", { page: pageIndex + 1, totalPages: pageCount })}>
          {pageIndex + 1} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          className={navButton}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label={tGenerated("nextPage")}
        >
          <CaretRight size={14} weight="bold" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`${navButton} hidden md:inline-flex`}
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          aria-label={tGenerated("lastPage")}
        >
          <CaretDoubleRight size={13} weight="bold" />
        </Button>
      </div>
    </div>
  )
}
