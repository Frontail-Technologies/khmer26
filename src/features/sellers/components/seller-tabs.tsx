"use client"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Storefront, Star } from "@phosphor-icons/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  useSellerCategories,
  useSellerListingsInfinite,
  useSellerReviewsInfinite,
} from "../api/sellers.queries"
import { useSellerListingFilters } from "../hooks/use-seller-listing-filters"
import type { SellerProfile } from "../api/sellers.api"
import { SellerListingsTab } from "./seller-listings-tab"
import { SellerReviewsTab } from "./seller-reviews-tab"

const countPill =
  "rounded-full bg-muted px-1.5 py-px text-2xs font-bold tabular-nums text-muted-foreground group-data-active/trigger:bg-primary/12 group-data-active/trigger:text-primary"
const trigger = "group/trigger cursor-pointer gap-1.5 text-sm max-sm:flex-1!"

interface SellerTabsProps {
  seller: SellerProfile
  isOwnProfile: boolean
}

export function SellerTabs({ seller, isOwnProfile }: SellerTabsProps) {
  const urlFilters = useSellerListingFilters()
  const { filters } = urlFilters
  const listings = useSellerListingsInfinite(seller.id, true, {
    q: filters.q,
    categoryId: filters.category || undefined,
    sort: filters.sort,
  })
  const categories = useSellerCategories(seller.id)
  const reviews = useSellerReviewsInfinite(seller.id)

  return (
    <Tabs defaultValue="listings" className="gap-4 sm:gap-6">
      <div className="-mx-3 bg-background px-1 max-md:sticky max-md:top-12 max-md:z-20 sm:mx-0 sm:px-0">
        <TabsList variant="line" className="gap-0 sm:gap-6">
          <TabsTrigger value="listings" className={trigger}>
            <Storefront size={16} weight="bold" />
            <span><LocalizedText id="listings" /></span>
            <span className={countPill}>{seller.listingCount}</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className={trigger}>
            <Star size={16} weight="bold" />
            <span><LocalizedText id="reviews" /></span>
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
          filters={filters}
          keyword={urlFilters.keyword}
          onKeywordChange={urlFilters.setKeyword}
          onCategoryChange={urlFilters.setCategory}
          onSortChange={urlFilters.setSort}
          onClearFilters={urlFilters.clear}
          isFiltered={urlFilters.isFiltered}
          categories={categories.data ?? []}
          inventoryTotal={seller.listingCount}
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
