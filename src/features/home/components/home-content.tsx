"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ListingFeedSkeleton, ListingSectionHeaderSkeleton } from "@/features/listings/components/listing-skeletons"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { CategorySection } from "@/features/categories/components/category-section"
import { LatestListingsSection } from "@/features/listings/components/latest-listings-section"
import { homeQueryOptions } from "../api/home.queries"
import type { HomeResponse } from "../api/home.api"
import { resolveHomeBlocks } from "../lib/home-blocks"
import { rememberHomeLayout, useRememberedHomeLayout, type HomeSkeletonBlock } from "../lib/home-layout-memory"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import { HomepageBanner } from "./homepage-banner"
import { SellCtaBanner } from "./sell-cta-banner"

const POPULAR_CATEGORIES_SLUG = "homepage-popular-categories"

function CategoriesSkeleton() {
  return (
    <section className="py-4 sm:py-6">
      <div className="flex items-center justify-between gap-4 pb-2.5 sm:pb-3">
        <Skeleton className="h-6 w-44 sm:h-7" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 pt-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="aspect-square w-full p-1 sm:p-2">
              <Skeleton className="h-full w-full rounded-2xl" />
            </div>
            <Skeleton className="mt-1.5 h-3 w-3/5" />
          </div>
        ))}
      </div>
    </section>
  )
}

function BannerSkeleton() {
  return (
    <div className="my-3 sm:my-4">
      <Skeleton className="w-full aspect-[21/6] sm:aspect-[21/5] md:aspect-[21/4] min-h-[90px] sm:min-h-[120px] rounded-xl sm:rounded-2xl" />
    </div>
  )
}

function ListingsSkeleton({ first }: { first: boolean }) {
  return (
    <section className="py-3 sm:py-4">
      <ListingSectionHeaderSkeleton />
      <ListingFeedSkeleton count={9} leadingCell={first} />
    </section>
  )
}

/** Draws the layout the home page last rendered (sections are admin-configured), else the default. */
export function HomeSkeleton() {
  const tGenerated = useTranslations("generated")
  const layout = useRememberedHomeLayout()
  const firstListings = layout.indexOf("listings")
  return (
    <div aria-busy="true" aria-label={tGenerated("loadingHomepage")}>
      {layout.slice(0, 3).map((block, i) =>
        block === "categories" ? (
          <CategoriesSkeleton key={i} />
        ) : block === "banner" ? (
          <BannerSkeleton key={i} />
        ) : (
          <ListingsSkeleton key={i} first={i === firstListings} />
        )
      )}
    </div>
  )
}

/** The blocks HomeContent will actually show (mirrors its empty-section rules), for the skeleton. */
function renderedLayout(data: HomeResponse): HomeSkeletonBlock[] {
  return resolveHomeBlocks(data.sections, data.featuredSections).flatMap((block): HomeSkeletonBlock[] => {
    if (block.key === "banner") {
      const has = data.banners.some((b) => b.placement === "homepage" || b.placement === "homepage_hero")
      return has ? ["banner"] : []
    }
    if (block.key === "categories") return data.popularCategories.length > 0 ? ["categories"] : []
    if (block.key === "latest") return data.newListings.length > 0 ? ["listings"] : []
    if (block.key === "cta") return []
    return (block.featuredSection?.listings.length ?? 0) > 0 ? ["listings"] : []
  })
}

export function HomeContent() {
  const tGenerated = useTranslations("generated")
  const { data, isPending, isError, refetch, isFetching } = useQuery(homeQueryOptions())
  const localized = useLocalizedText()
  const layoutKey = data ? renderedLayout(data).join(",") : null

  useEffect(() => {
    if (layoutKey) rememberHomeLayout(layoutKey.split(",") as HomeSkeletonBlock[])
  }, [layoutKey])

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
