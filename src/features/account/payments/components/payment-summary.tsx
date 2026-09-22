import {
  CreditCard,
  CalendarCheck,
  QrCode,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import type { AccountPaymentRecord } from "../../types"

interface PaymentSummaryProps {
  payments: AccountPaymentRecord[]
}

export function PaymentSummary({ payments }: PaymentSummaryProps) {
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const lastPayment = payments[0]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardContent className="p-0 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <CreditCard size={22} weight="fill" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground block truncate">
              Total Spent
            </span>
            <span className="text-xl sm:text-2xl font-black text-foreground">
              ${totalPaid.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardContent className="p-0 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
            <CalendarCheck size={22} weight="fill" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground block truncate">
              Last Payment
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground truncate block">
              {lastPayment ? lastPayment.date : "No payments"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardContent className="p-0 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <QrCode size={22} weight="fill" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground block truncate">
              Primary Method
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground truncate block">
              Bakong KHQR
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
