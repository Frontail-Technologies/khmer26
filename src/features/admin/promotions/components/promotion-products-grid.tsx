"use client"

import { useState } from "react"
import { Sparkle, ArrowUp, Fire, Clock } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { PromotionProduct } from "../types"

interface PromotionProductsGridProps {
  products: PromotionProduct[]
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  featured: <Sparkle size={20} className="text-amber-500" />,
  top_category: <ArrowUp size={20} className="text-indigo-500" />,
  urgent: <Fire size={20} className="text-rose-500" />,
  daily_bump: <Clock size={20} className="text-blue-500" />,
}

export function PromotionProductsGrid({ products: initialProducts }: PromotionProductsGridProps) {
  const [products, setProducts] = useState(initialProducts)

  const toggleProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {products.map((prod) => (
          <Card key={prod.id} className="p-4 bg-card border-border flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-muted/60 border border-border/60">
                  {TIER_ICONS[prod.type]}
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {prod.durationDays} Days
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-xs text-foreground leading-snug">{prod.name}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{prod.description}</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border/40 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Price Tier</span>
                <span className="font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded text-[10px]">
                  {prod.priceDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Active Ads</span>
                <span className="font-bold text-foreground">{prod.activeCampaignsCount} running</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {prod.isActive ? "Available for Purchase" : "Disabled"}
                </span>
                <Switch
                  checked={prod.isActive}
                  onCheckedChange={() => toggleProduct(prod.id)}
                  aria-label="Toggle tier availability"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
