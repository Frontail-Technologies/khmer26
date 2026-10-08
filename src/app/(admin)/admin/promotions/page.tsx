import type { Metadata } from "next"
import { PromotionWorkspace } from "@/features/admin/promotions/components/promotion-workspace"

export const metadata: Metadata = {
  title: "Ads",
  description: "Manage ad packages and active listing promotions.",
}

export default function AdminPromotionsPage() {
  return <PromotionWorkspace />
}
