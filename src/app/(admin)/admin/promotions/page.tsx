import type { Metadata } from "next"
import { PromotionWorkspace } from "@/features/admin/promotions/components/promotion-workspace"
import { DEMO_ACTIVE_PROMOTIONS } from "@/features/admin/promotions/data/demo-promotion-data"

export const metadata: Metadata = {
  title: "Promotions",
  description: "Manage marketplace listing boosts and featured promotions.",
}

export default function AdminPromotionsPage() {
  return (
    <PromotionWorkspace
      activePromotions={DEMO_ACTIVE_PROMOTIONS}
    />
  )
}
