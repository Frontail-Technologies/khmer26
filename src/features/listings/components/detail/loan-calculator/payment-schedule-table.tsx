import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import type { PaymentScheduleRow } from "./types"

interface PaymentScheduleTableProps {
  schedule: PaymentScheduleRow[]
  currency?: string
}

export function PaymentScheduleTable({
  schedule,
  currency = "USD",
}: PaymentScheduleTableProps) {
  if (!schedule || schedule.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-bold text-foreground">
          Payment Schedule
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          {schedule.length} payments
        </span>
      </div>

      <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs max-h-80 overflow-y-auto">
        <Table className="text-xs">
          <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-md z-10 border-b border-border/80 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 py-2 px-3 whitespace-nowrap text-center">No</TableHead>
              <TableHead className="h-9 py-2 px-3 whitespace-nowrap text-right">Payment</TableHead>
              <TableHead className="h-9 py-2 px-3 whitespace-nowrap text-right">Interest</TableHead>
              <TableHead className="h-9 py-2 px-3 whitespace-nowrap text-right">Principal</TableHead>
              <TableHead className="h-9 py-2 px-3 whitespace-nowrap text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/50">
            {schedule.map((row) => (
              <TableRow
                key={row.month}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="py-2 px-3 text-center text-muted-foreground font-mono">
                  {row.month}
                </TableCell>
                <TableCell className="py-2 px-3 text-right font-semibold text-foreground font-mono">
                  {formatPriceWithCurrency(Math.round(row.payment), currency)}
                </TableCell>
                <TableCell className="py-2 px-3 text-right text-muted-foreground font-mono">
                  {formatPriceWithCurrency(Math.round(row.interest), currency)}
                </TableCell>
                <TableCell className="py-2 px-3 text-right text-foreground font-mono">
                  {formatPriceWithCurrency(Math.round(row.principal), currency)}
                </TableCell>
                <TableCell className="py-2 px-3 text-right font-medium text-foreground/90 font-mono">
                  {formatPriceWithCurrency(Math.round(row.balance), currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
