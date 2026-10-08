"use client"

import { Storefront, Star } from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  useSellerListingsInfinite,
  useSellerReviewsInfinite,
} from "../api/sellers.queries"
import type { SellerProfile } from "../api/sellers.api"
import { SellerListingsTab } from "./seller-listings-tab"
import { SellerReviewsTab } from "./seller-reviews-tab"

const countPill =
  "ml-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground"

interface SellerTabsProps {
  seller: SellerProfile
  isOwnProfile: boolean
}

export function SellerTabs({ seller, isOwnProfile }: SellerTabsProps) {
  const listings = useSellerListingsInfinite(seller.id)
  const reviews = useSellerReviewsInfinite(seller.id)

  return (
    <Tabs defaultValue="listings" className="space-y-6">
      <div className="flex items-center">
        <TabsList className="h-10 sm:h-11 p-1 bg-muted/60 border border-border/60 rounded-xl gap-1 w-full sm:w-auto justify-start">
          <TabsTrigger
            value="listings"
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-bold gap-2 rounded-lg cursor-pointer"
          >
            <Storefront size={16} weight="bold" />
            <span>Listings</span>
            <span className={countPill}>{seller.listingCount}</span>
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-bold gap-2 rounded-lg cursor-pointer"
          >
            <Star size={16} weight="bold" />
            <span>Reviews</span>
            <span className={countPill}>{seller.rating?.count ?? 0}</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="listings" className="focus-visible:outline-none">
        <SellerListingsTab
          sellerName={seller.shopName}
          pages={listings.data?.pages}
          isPending={listings.isPending}
          isError={listings.isError}
          hasNextPage={listings.hasNextPage}
          isFetchingNextPage={listings.isFetchingNextPage}
          onLoadMore={() => listings.fetchNextPage()}
          onRetry={() => listings.refetch()}
        />
      </TabsContent>

      <TabsContent value="reviews" className="focus-visible:outline-none">
        <SellerReviewsTab
          seller={seller}
          isOwnProfile={isOwnProfile}
          pages={reviews.data?.pages}
          isPending={reviews.isPending}
          isError={reviews.isError}
          hasNextPage={reviews.hasNextPage}
          isFetchingNextPage={reviews.isFetchingNextPage}
          onLoadMore={() => reviews.fetchNextPage()}
          onRetry={() => reviews.refetch()}
        />
      </TabsContent>
    </Tabs>
  )
}
