"use client"

import { useState } from "react"
import { CheckCircle, ShieldCheck, Buildings, Crown, User } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { SubscriptionPlan } from "../types"

interface SubscriptionPlansGridProps {
  plans: SubscriptionPlan[]
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  free: <User size={20} className="text-muted-foreground" />,
  pro: <ShieldCheck size={20} className="text-blue-500" />,
  business: <Buildings size={20} className="text-purple-500" />,
  enterprise: <Crown size={20} className="text-amber-500" />,
}

export function SubscriptionPlansGrid({ plans: initialPlans }: SubscriptionPlansGridProps) {
  const [plans, setPlans] = useState(initialPlans)

  const togglePlan = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-4 bg-card rounded-xl border-0 flex flex-col justify-between shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-muted/60 border border-border/60">
                  {TIER_ICONS[plan.tier]}
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {plan.billingInterval}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-xs text-foreground leading-snug">{plan.name}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Included Features
                </span>
                <ul className="space-y-1 text-[11px] text-foreground">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle size={12} weight="fill" className="text-emerald-500 shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border/40 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Price Tier</span>
                <span className="font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded text-[10px]">
                  {plan.priceDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Subscribed Merchants</span>
                <span className="font-bold text-foreground">{plan.subscribersCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {plan.isActive ? "Plan Enabled" : "Plan Paused"}
                </span>
                <Switch
                  checked={plan.isActive}
                  onCheckedChange={() => togglePlan(plan.id)}
                  aria-label="Toggle plan availability"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
