import type { Metadata } from "next"
import { PromotionWorkspace } from "@/features/admin/promotions/components/promotion-workspace"

export const metadata: Metadata = {
  title: "Promotions",
  description: "Manage marketplace listing boosts and featured promotions.",
}

export default function AdminPromotionsPage() {
  return <PromotionWorkspace />
}
