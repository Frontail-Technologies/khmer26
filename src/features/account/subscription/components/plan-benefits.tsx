import { CheckCircle, Sparkle, Buildings } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AccountSubscriptionPlan } from "../../types"

interface PlanBenefitsProps {
  plans: AccountSubscriptionPlan[]
}

export function PlanBenefits({ plans }: PlanBenefitsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-foreground">
          Upgrade Seller Membership
        </h3>
        <p className="text-xs text-muted-foreground">
          Select a tier to scale your inventory, boost views, and build your brand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans
          .filter((p) => p.tier !== "free")
          .map((plan) => {
            const isPlus = plan.tier === "seller_plus"

            return (
              <Card
                key={plan.id}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <CardHeader className="p-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isPlus ? (
                          <Sparkle size={20} weight="fill" className="text-accent" />
                        ) : (
                          <Buildings size={20} weight="fill" className="text-primary" />
                        )}
                        <CardTitle className="text-base font-bold text-foreground">
                          {plan.name}
                        </CardTitle>
                      </div>

                      {isPlus && (
                        <Badge
                          variant="outline"
                          className="bg-accent/15 text-accent border-accent/30 text-[10px] font-bold"
                        >
                          Most Popular
                        </Badge>
                      )}
                    </div>

                    <div className="pt-2">
                      <span className="text-2xl font-black text-foreground">
                        ${plan.priceMonthly}
                        <span className="text-xs font-normal text-muted-foreground">
                          {" "}
                          / month
                        </span>
                      </span>
                    </div>

                    <CardDescription className="text-xs text-muted-foreground pt-1">
                      {isPlus
                        ? "Ideal for active individual sellers and pro traders."
                        : "For established businesses, auto dealerships, and real estate agencies."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0 space-y-2 pt-2 border-t border-border/60">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                        <CheckCircle size={15} weight="fill" className="text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </CardContent>
                </div>

                <div className="pt-5 mt-auto">
                  <Button
                    type="button"
                    disabled
                    className="w-full h-auto min-h-10 py-2.5 px-4 text-xs font-bold rounded-xl bg-primary text-primary-foreground opacity-70 cursor-not-allowed whitespace-normal text-center"
                  >
                    Upgrade to {plan.name}
                  </Button>
                </div>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
