import { LocalizedText } from "@/components/i18n/localized-text"
import { PlanCard } from "@/features/payments/components/plan-card"
import type { SubscriptionPlan } from "../api/subscription.api"

export function PlanBenefits({ plans, currentPlanId }: { plans: SubscriptionPlan[]; currentPlanId: string }) {
  const alternatives = plans.filter((plan) => plan.id !== currentPlanId)
  if (alternatives.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-base font-bold"><LocalizedText id="availableSellerPlans" /></h2>
      <div className="grid gap-4 md:grid-cols-2">
        {alternatives.map((plan, index) => (
          <PlanCard key={plan.id} plan={plan} popular={index === 0} />
        ))}
      </div>
    </section>
  )
}
