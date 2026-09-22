import { AccountPageHeader } from "@/features/account/components/account-page-header"
import { CurrentPlanCard } from "@/features/account/subscription/components/current-plan-card"
import { PlanBenefits } from "@/features/account/subscription/components/plan-benefits"
import { SubscriptionHistory } from "@/features/account/subscription/components/subscription-history"
import { DEMO_SUBSCRIPTION_PLANS } from "@/features/account/data/demo-account-data"

export const metadata = {
  title: "Subscription",
  description: "Manage your seller subscription and membership plan on Khmer26",
}

export default function AccountSubscriptionPage() {
  const currentPlan =
    DEMO_SUBSCRIPTION_PLANS.find((p) => p.isCurrent) || DEMO_SUBSCRIPTION_PLANS[0]

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Subscription & Plans"
        description="Manage your seller membership tier and listing allowances."
      />

      <div className="space-y-6">
        <CurrentPlanCard currentPlan={currentPlan} />
        <PlanBenefits plans={DEMO_SUBSCRIPTION_PLANS} />
        <SubscriptionHistory />
      </div>
    </div>
  )
}
