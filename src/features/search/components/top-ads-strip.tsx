"use client"

import { useTranslations } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { searchListings, type ListingSearchInput } from "@/features/listings/api/listings.api"
import { ListingCard } from "@/features/listings/components/listing-card"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { sanitizeFieldFilters, type SearchFilters } from "../lib/search-filters"

const STRIP_SIZE = 10

/** Promoted ("Top Ads") listings that match the current filters, shown above the results. */
export function TopAdsStrip({ filters, definitions }: { filters: SearchFilters; definitions?: CategoryField[] }) {
  const t = useTranslations("ui.topAds")
  const input: ListingSearchInput = {
    q: filters.q,
    category: filters.category,
    provinceId: filters.provinceId,
    districtId: filters.districtId,
    communeId: filters.communeId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    currency: filters.currency,
    sort: "newest",
    fields: definitions ? sanitizeFieldFilters(filters.fields, definitions) : {},
    featuredOnly: true,
  }
  const { data } = useQuery({
    queryKey: marketplaceKeys.search.results({ ...input, strip: true }),
    queryFn: () => searchListings(input, 1, STRIP_SIZE),
  })

  const listings = data?.items.map(toListingCardData) ?? []
  if (listings.length === 0) return null

  return (
    <section aria-label={t("title")} className="mb-4 rounded-xl bg-primary/10 p-3 sm:p-4">
      <h2 className="mb-3 text-base font-bold text-foreground">{t("title")}</h2>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {listings.map((listing) => (
          <div key={listing.id} className="w-44 shrink-0 snap-start sm:w-52 lg:w-60">
            <ListingCard listing={listing} featured />
          </div>
        ))}
      </div>
    </section>
  )
}
