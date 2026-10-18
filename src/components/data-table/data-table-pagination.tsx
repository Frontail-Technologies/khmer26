import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 px-1 py-1 sm:px-2 sm:py-3 min-w-0 w-full overflow-hidden">
      <div className="text-xs text-muted-foreground text-center sm:text-left shrink-0">
        {tDynamic("showingResults", {
          start: rowCount === 0 ? 0 : pageIndex * pageSize + 1,
          end: Math.min((pageIndex + 1) * pageSize, rowCount),
          total: rowCount,
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-6 min-w-0 max-w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap"><LocalizedText id="rowsPerPage" /></span>
          <Select
            value={`${pageSize}`}
            items={pageSizeSelectOptions}
            onValueChange={(val) => {
              if (val) table.setPageSize(Number(val))
            }}
          >
            <SelectTrigger className="h-8 w-16 sm:w-18 text-xs bg-background rounded-lg border-input px-2">
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

        <div className="text-xs font-semibold text-foreground whitespace-nowrap shrink-0">
          {tDynamic("pageOf", { page: pageIndex + 1, totalPages: pageCount })}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label={tGenerated("firstPage")}
          >
            <CaretDoubleLeft size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={tGenerated("previousPage")}
          >
            <CaretLeft size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={tGenerated("nextPage")}
          >
            <CaretRight size={13} weight="bold" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label={tGenerated("lastPage")}
          >
            <CaretDoubleRight size={13} weight="bold" />
          </Button>
        </div>
      </div>
    </div>
  )
}
