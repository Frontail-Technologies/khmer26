"use client"

import { PromotionTable } from "./promotion-table"
import type { ActivePromotionItem } from "../types"

interface PromotionWorkspaceProps {
  activePromotions: ActivePromotionItem[]
}

export function PromotionWorkspace({
  activePromotions,
}: PromotionWorkspaceProps) {
  return (
    <div className="space-y-4">
      <PromotionTable initialPromotions={activePromotions} />
    </div>
  )
}
