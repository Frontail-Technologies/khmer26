import Link from "next/link"
import { Crown, CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AccountSubscriptionPlan } from "../../types"

interface CurrentPlanCardProps {
  currentPlan: AccountSubscriptionPlan
}

export function CurrentPlanCard({ currentPlan }: CurrentPlanCardProps) {
  return (
    <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 shadow-2xs">
      <CardContent className="p-0 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <Crown size={24} weight="fill" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {currentPlan.name}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-primary/20 text-primary border-primary/30 text-[11px] font-bold"
                >
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Standard marketplace seller membership
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-foreground block">
              $0
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / forever
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              No renewal fees required
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-primary/15 space-y-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Included in your plan:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentPlan.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-foreground/90">
                <CheckCircle size={15} weight="fill" className="text-primary shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:justify-end">
          <Button
            render={
              <Link href="/pricing">
                <span>Compare All Seller Plans</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            }
            className="w-full sm:w-auto h-10 px-4.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-1.5 shadow-2xs"
          />
        </div>
      </CardContent>
    </Card>
  )
}
