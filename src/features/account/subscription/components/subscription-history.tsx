import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"
import { ClockCounterClockwise } from "@phosphor-icons/react"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SubscriptionHistoryItem } from "../api/subscription.api"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"

export function SubscriptionHistory({ items }: { items: SubscriptionHistoryItem[] }) {
  const tGenerated = useTranslations("generated")
  const localized = useLocalizedText()
  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:p-5">
      <CardHeader className="p-0 pb-4"><div className="flex items-center gap-2 text-primary"><ClockCounterClockwise size={18} weight="bold" /><CardTitle className="text-base font-bold text-foreground"><LocalizedText id="membershipHistory" /></CardTitle></div></CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center"><p className="text-xs font-bold"><LocalizedText id="noPaidMembershipHistory" /></p><p className="mt-1 text-xxs text-muted-foreground"><LocalizedText id="previousSellerPlansWillAppearHere" /></p></div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b font-bold text-muted-foreground"><th className="pb-2"><LocalizedText id="plan" /></th><th className="pb-2"><LocalizedText id="started" /></th><th className="pb-2"><LocalizedText id="expires" /></th><th className="pb-2 text-right"><LocalizedText id="status" /></th></tr></thead><tbody className="divide-y">{items.map((item) => <tr key={item.id}><td className="py-3 font-bold">{localized(item.plan.name, item.plan.nameKm)}</td><td className="py-3 text-muted-foreground">{formatDate(item.startedAt)}</td><td className="py-3 text-muted-foreground">{item.expiresAt ? formatDate(item.expiresAt) : tGenerated("noExpiry")}</td><td className="py-3 text-right"><StatusBadge label={item.status === "active" ? tGenerated("active") : tGenerated("expired")} tone={item.status === "active" ? "success" : "neutral"} size="sm" /></td></tr>)}</tbody></table></div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value))
}
