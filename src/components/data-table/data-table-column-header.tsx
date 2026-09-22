import { CaretUp, CaretDown, CaretUpDown } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import type { DataTableColumnHeaderProps } from "./types"

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-xs font-bold text-foreground", className)}>{title}</div>
  }

  const isSorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "-ml-2.5 h-8 px-2.5 text-xs font-bold text-foreground hover:text-foreground data-[state=open]:bg-muted flex items-center gap-1",
        className
      )}
    >
      <span>{title}</span>
      {isSorted === "desc" ? (
        <CaretDown size={14} weight="bold" className="text-primary" />
      ) : isSorted === "asc" ? (
        <CaretUp size={14} weight="bold" className="text-primary" />
      ) : (
        <CaretUpDown size={14} className="text-muted-foreground/70" />
      )}
    </Button>
  )
}
