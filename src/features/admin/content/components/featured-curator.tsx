"use client"

import { useState } from "react"
import {
  Plus,
  Trash,
  CaretUp,
  CaretDown,
  Storefront,
  Tag,
  ShoppingBag,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { FeaturedItem } from "../types"

interface FeaturedCuratorProps {
  initialFeaturedListings: FeaturedItem[]
}

export function FeaturedCurator({ initialFeaturedListings }: FeaturedCuratorProps) {
  const [items, setItems] = useState<FeaturedItem[]>(initialFeaturedListings)

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return
    }
    const newItems = [...items]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setItems(newItems)
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-card rounded-xl shadow-2xs">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground block">
            Featured & Sponsored Content Curation
          </span>
          <span className="text-[11px] text-muted-foreground block">
            Select and rank marketplace listings, merchants, and categories for top spotlight slots.
          </span>
        </div>

        <Button size="sm" className="h-8 text-xs">
          <Plus size={14} className="mr-1.5" />
          Add Spotlight Item
        </Button>
      </div>

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid grid-cols-3 h-8 bg-muted/60 p-1 mb-3">
          <TabsTrigger value="listings" className="text-xs">
            <ShoppingBag size={13} className="mr-1.5" />
            Featured Listings ({items.length})
          </TabsTrigger>
          <TabsTrigger value="sellers" className="text-xs">
            <Storefront size={13} className="mr-1.5" />
            Top Dealerships & Stores (4)
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs">
            <Tag size={13} className="mr-1.5" />
            Trending Categories (6)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-2.5">
          {items.map((item, idx) => (
            <Card key={item.id} className="p-3 bg-card border-0 rounded-xl shadow-2xs text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-6 rounded-md bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground shrink-0">
                  #{idx + 1}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{item.title}</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1 rounded">
                      {item.entityId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{item.subtitle}</span>
                    {item.price && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-foreground">${item.price.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up")}
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Move up"
                >
                  <CaretUp size={14} weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, "down")}
                  className="size-7 text-muted-foreground hover:text-foreground"
                  aria-label="Move down"
                >
                  <CaretDown size={14} weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeItem(item.id)}
                  className="size-7 text-muted-foreground hover:text-destructive"
                  aria-label="Remove item"
                >
                  <Trash size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sellers" className="pt-2">
          <Card className="p-6 text-center text-xs text-muted-foreground bg-card border-0 rounded-xl shadow-2xs">
            Dealer and store spotlights are synchronized with active business subscription packages.
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="pt-2">
          <Card className="p-6 text-center text-xs text-muted-foreground bg-card border-0 rounded-xl shadow-2xs">
            Trending category tiles appear on mobile app home screen according to search volume.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
