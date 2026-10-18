import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import {
  CreditCard,
  CalendarCheck,
  QrCode,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import type { AccountPaymentRecord } from "../../types"

interface PaymentSummaryProps {
  payments: AccountPaymentRecord[]
  summary: { totalPaid: number; primaryMethod: string | null }
}

export function PaymentSummary({ payments, summary }: PaymentSummaryProps) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.account")
  const lastPayment = payments[0]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardContent className="p-0 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <CreditCard size={22} weight="fill" />
          </div>
          <div className="min-w-0">
            <span className="text-xxs sm:text-xs font-semibold text-muted-foreground block truncate">
              <LocalizedText id="totalSpent" />
            </span>
            <span className="text-xl sm:text-2xl font-black text-foreground">
              ${summary.totalPaid.toFixed(2)}
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
            <span className="text-xxs sm:text-xs font-semibold text-muted-foreground block truncate">
              <LocalizedText id="lastPayment" />
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground truncate block">
              {lastPayment?.createdAt
                ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(lastPayment.createdAt))
                : tGenerated("noPayments")}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
        <CardContent className="p-0 flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
            <QrCode size={22} weight="fill" />
          </div>
          <div className="min-w-0">
            <span className="text-xxs sm:text-xs font-semibold text-muted-foreground block truncate">
              <LocalizedText id="primaryMethod" />
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground truncate block">
              {summary.primaryMethod ?? t("noMethod")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
