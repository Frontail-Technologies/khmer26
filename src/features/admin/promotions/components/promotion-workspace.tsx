"use client"

import { PromotionTable } from "./promotion-table"
import { useAdminActivePromotions } from "../hooks/promotions.queries"
import type { ActivePromotionItem } from "../types"

interface PromotionWorkspaceProps {
  activePromotions?: ActivePromotionItem[]
}

export function PromotionWorkspace({
  activePromotions: fallbackPromotions = [],
}: PromotionWorkspaceProps) {
  const { data } = useAdminActivePromotions()
  const activePromotions = data?.items ?? fallbackPromotions

  return (
    <div className="space-y-4">
      <PromotionTable initialPromotions={activePromotions} />
    </div>
  )
}
