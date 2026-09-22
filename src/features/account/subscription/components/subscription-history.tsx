import { ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"

const DEMO_HISTORY = [
  {
    id: "sub-1",
    planName: "Free Membership",
    startDate: "Mar 15, 2024",
    endDate: "Lifetime",
    status: "active",
  },
]

export function SubscriptionHistory() {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-2 text-primary">
          <ClockCounterClockwise size={18} weight="bold" />
          <CardTitle className="text-base font-bold text-foreground">
            Membership History
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-bold">
                <th className="pb-2">Plan</th>
                <th className="pb-2">Started</th>
                <th className="pb-2">Expires</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {DEMO_HISTORY.map((item) => (
                <tr key={item.id} className="text-foreground">
                  <td className="py-3 font-bold">{item.planName}</td>
                  <td className="py-3 text-muted-foreground">{item.startDate}</td>
                  <td className="py-3 text-muted-foreground">{item.endDate}</td>
                  <td className="py-3 text-right">
                    <StatusBadge
                      label={item.status}
                      tone="success"
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
