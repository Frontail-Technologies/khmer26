import type { Metadata } from "next"
import { PromotionWorkspace } from "@/features/admin/promotions/components/promotion-workspace"
import {
  DEMO_PROMOTION_STATS,
  DEMO_PROMOTION_PRODUCTS,
  DEMO_ACTIVE_PROMOTIONS,
} from "@/features/admin/promotions/data/demo-promotion-data"

export const metadata: Metadata = {
  title: "Promotions & Boosts",
  description: "Manage featured ads, homepage spotlights, and promotional campaigns.",
}

export default function AdminPromotionsPage() {
  return (
    <PromotionWorkspace
      stats={DEMO_PROMOTION_STATS}
      products={DEMO_PROMOTION_PRODUCTS}
      activePromotions={DEMO_ACTIVE_PROMOTIONS}
    />
  )
}
