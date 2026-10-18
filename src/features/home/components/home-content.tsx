"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { CategorySection } from "@/features/categories/components/category-section"
import { LatestListingsSection } from "@/features/listings/components/latest-listings-section"
import { homeQueryOptions } from "../api/home.queries"
import { resolveHomeBlocks } from "../lib/home-blocks"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import { HomepageBanner } from "./homepage-banner"
import { SellCtaBanner } from "./sell-cta-banner"

const POPULAR_CATEGORIES_SLUG = "homepage-popular-categories"

function HomeSkeleton() {
  const tGenerated = useTranslations("generated")
  return (
    <div aria-busy="true" aria-label={tGenerated("loadingHomepage")}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 py-4 sm:py-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="my-3 sm:my-4 w-full aspect-[21/6] sm:aspect-[21/5] md:aspect-[21/4] rounded-xl sm:rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-3.5 py-3 sm:py-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function HomeContent() {
  const tGenerated = useTranslations("generated")
  const { data, isPending, isError, refetch, isFetching } = useQuery(homeQueryOptions())
  const localized = useLocalizedText()

  if (isPending) return <HomeSkeleton />

  if (isError || !data) {
    return (
      <div className="my-8 rounded-xl border border-dashed border-border/80 bg-card/40 p-8 text-center">
        <p className="text-sm font-semibold text-foreground"><LocalizedText id="weCouldnTLoadTheHomepage" /></p>
        <p className="mt-1 text-xs text-muted-foreground"><LocalizedText id="pleaseCheckYourConnectionAndTryAgain" /></p>
        <Button
          type="button"
          size="sm"
          className="mt-4"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          {isFetching ? tGenerated("retrying") : tGenerated("tryAgain")}
        </Button>
      </div>
    )
  }

  const blocks = resolveHomeBlocks(data.sections, data.featuredSections)
  const popularSection = data.featuredSections.find((s) => s.slug === POPULAR_CATEGORIES_SLUG)
  const categories = [...data.popularCategories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ id: c.id, name: localized(c.name, c.nameKm), slug: c.slug, imageUrl: getMediaUrl(c.imageR2Key) }))

  return (
    <>
      {blocks.map((block) => {
        switch (block.key) {
          case "banner":
            return (
              <HomepageBanner
                key="banner"
                banners={data.banners.filter((banner) =>
                  banner.placement === "homepage" || banner.placement === "homepage_hero"
                )}
              />
            )
          case "categories":
            return (
              <CategorySection
                key="categories"
                categories={categories}
                title={popularSection ? localized(popularSection.title, popularSection.titleKm) : undefined}
              />
            )
          case "latest": {
            const listings = data.newListings
              .slice(0, block.itemCount ?? undefined)
              .map(toListingCardData)
            if (listings.length === 0) return null
            return (
              <LatestListingsSection key="latest" listings={listings} title={block.title ? localized(block.title, block.titleKm) : undefined} />
            )
          }
          case "cta": {
            const ctaBanners = data.banners.filter((banner) => banner.placement === "homepage_cta")
            return ctaBanners.length > 0
              ? <HomepageBanner key="cta" banners={ctaBanners} />
              : <SellCtaBanner key="cta" />
          }
          default: {
            const featured = block.featuredSection
            if (!featured) return null
            const listings = featured.listings
              .slice(0, block.itemCount ?? undefined)
              .map(toListingCardData)
            if (listings.length === 0) return null
            return (
              <LatestListingsSection
                key={block.key}
                listings={listings}
                title={localized(featured.title, featured.titleKm)}
              />
            )
          }
        }
      })}
      {!blocks.some((block) => block.key === "cta") && <SellCtaBanner />}
    </>
  )
}
