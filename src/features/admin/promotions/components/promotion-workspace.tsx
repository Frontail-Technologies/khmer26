"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromotionTable } from "./promotion-table"
import { PackageCatalog } from "./package-catalog"
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
    <Tabs defaultValue="active" className="space-y-4">
      <TabsList variant="line">
        <TabsTrigger value="active">Active Ads</TabsTrigger>
        <TabsTrigger value="packages">Packages</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <PromotionTable initialPromotions={activePromotions} />
      </TabsContent>

      <TabsContent value="packages">
        <PackageCatalog />
      </TabsContent>
    </Tabs>
  )
}
