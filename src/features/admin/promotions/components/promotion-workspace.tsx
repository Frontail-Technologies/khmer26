"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkle, ListBullets } from "@phosphor-icons/react"
import { PromotionSummaryMetrics } from "./promotion-summary-metrics"
import { PromotionProductsGrid } from "./promotion-products-grid"
import { PromotionTable } from "./promotion-table"
import type { PromotionProduct, ActivePromotionItem, PromotionStats } from "../types"

interface PromotionWorkspaceProps {
  stats: PromotionStats
  products: PromotionProduct[]
  activePromotions: ActivePromotionItem[]
}

export function PromotionWorkspace({
  stats,
  products,
  activePromotions,
}: PromotionWorkspaceProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <PromotionSummaryMetrics stats={stats} />

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid grid-cols-2 h-9 bg-muted/60 p-1 mb-4 w-full sm:w-[360px]">
          <TabsTrigger value="campaigns" className="text-xs">
            <ListBullets size={13} className="mr-1.5" />
            Active Campaigns ({activePromotions.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs">
            <Sparkle size={13} className="mr-1.5" />
            Boost Products ({products.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <PromotionTable initialPromotions={activePromotions} />
        </TabsContent>

        <TabsContent value="products">
          <PromotionProductsGrid products={products} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
