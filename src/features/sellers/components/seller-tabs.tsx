"use client"

import { useState } from "react"
import { Storefront, Info, Star } from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SellerListingsTab } from "./seller-listings-tab"
import { SellerAboutTab } from "./seller-about-tab"
import { SellerReviewsTab } from "./seller-reviews-tab"
import type { SellerProfileDetail, SellerReview } from "../types"
import type { ListingCard } from "@/types"

interface SellerTabsProps {
  seller: SellerProfileDetail
  listings: ListingCard[]
  reviews: SellerReview[]
}

export function SellerTabs({ seller, listings, reviews }: SellerTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("listings")

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => setActiveTab(val as string)}
      className="space-y-6"
    >
      <div className="flex items-center">
        <TabsList className="h-10 sm:h-11 p-1 bg-muted/60 border border-border/60 rounded-xl gap-1 w-full sm:w-auto justify-start">
          <TabsTrigger
            value="listings"
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-bold gap-2 rounded-lg cursor-pointer"
          >
            <Storefront size={16} weight="bold" />
            <span>Listings</span>
            <span className="ml-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {listings.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="about"
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-bold gap-2 rounded-lg cursor-pointer"
          >
            <Info size={16} weight="bold" />
            <span>About</span>
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-bold gap-2 rounded-lg cursor-pointer"
          >
            <Star size={16} weight="bold" />
            <span>Reviews</span>
            <span className="ml-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {reviews.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="listings" className="focus-visible:outline-none">
        <SellerListingsTab
          initialListings={listings}
          sellerName={seller.name}
        />
      </TabsContent>

      <TabsContent value="about" className="focus-visible:outline-none">
        <SellerAboutTab seller={seller} />
      </TabsContent>

      <TabsContent value="reviews" className="focus-visible:outline-none">
        <SellerReviewsTab seller={seller} reviews={reviews} />
      </TabsContent>
    </Tabs>
  )
}
