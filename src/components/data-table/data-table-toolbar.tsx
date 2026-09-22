import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import type { DataTableToolbarProps } from "./types"

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableToolbarProps<TData>) {
  if (!searchKey) return null

  const column = table.getColumn(searchKey)
  if (!column) return null

  const filterValue = (column.getFilterValue() as string) ?? ""

  return (
    <div className="flex items-center justify-between gap-3 p-3 border-b border-border/70 bg-card">
      <div className="relative flex-1 max-w-sm">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder={searchPlaceholder}
          value={filterValue}
          onChange={(e) => column.setFilterValue(e.target.value)}
          className="pl-9 pr-8 h-9 text-xs bg-background rounded-xl"
        />
        {filterValue && (
          <button
            type="button"
            onClick={() => column.setFilterValue("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
