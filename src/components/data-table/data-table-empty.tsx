import { TableRow, TableCell } from "@/components/ui/table"
import { EmptyState } from "@/components/shared/EmptyState"
import { Database } from "@phosphor-icons/react"

interface DataTableEmptyProps {
  colSpan: number
  title?: string
  description?: string
}

export function DataTableEmpty({
  colSpan,
  title = "No results found",
  description = "There are no records matching your criteria.",
}: DataTableEmptyProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-48 text-center p-0">
        <EmptyState
          icon={<Database size={32} className="text-muted-foreground" />}
          title={title}
          description={description}
        />
      </TableCell>
    </TableRow>
  )
}
