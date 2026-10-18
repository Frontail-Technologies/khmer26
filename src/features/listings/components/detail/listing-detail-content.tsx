"use client"

import { useLocale, useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/Container"
import { ApiError } from "@/lib/api/client"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import {
  useListingDetail,
  useSellerListings,
  useSimilarListings,
} from "../../api/listing-detail.queries"
import { toGalleryImages } from "../../lib/listing-detail-format"
import { isLoanEligible } from "../../lib/loan-eligibility"
import { usePublicSafetyTips } from "@/features/content/hooks/content.queries"
import { localizeTip } from "@/features/content/lib/localize"
import type { Locale } from "@/i18n/config"
import { ListingBreadcrumbs } from "./listing-breadcrumbs"
import { ListingGallery } from "./listing-gallery"
import { ListingPrimaryPanel } from "./listing-primary-panel"
import { ListingSellerCard } from "./listing-seller-card"
import { ListingInfoCard } from "./listing-info-card"
import { ListingSafetyCard } from "./listing-safety-card"
import { ListingCardsSection } from "./listing-cards-section"
import { ListingMobileActionBar } from "./listing-mobile-action-bar"
import { ListingMobileGalleryControls } from "./listing-mobile-gallery-controls"
import { LoanCalculatorCard } from "./loan-calculator/loan-calculator-card"

const MORE_FROM_SELLER_LIMIT = 4

function DetailSkeleton() {
  const tGenerated = useTranslations("generated")
  return (
    <Container className="py-3 sm:py-4">
      <div
        aria-busy="true"
        aria-label={tGenerated("loadingListing")}
        className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6"
      >
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="aspect-4/3 sm:aspect-16/10 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <div className="space-y-4 lg:col-span-4">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  )
}

export function ListingDetailContent({ id }: { id: string }) {
  const tGenerated = useTranslations("generated")
  const query = useListingDetail(id)
  const listing = query.data
  const similar = useSimilarListings(id, Boolean(listing))
  const sellerListings = useSellerListings(listing?.seller?.id, Boolean(listing))
  const safetyTips = usePublicSafetyTips("listing_detail")
  const locale = useLocale() as Locale
  const safetyTipText = safetyTips.data?.map((item) => localizeTip(item, locale)) ?? []

  if (query.isPending) return <DetailSkeleton />

  if (query.isError || !listing) {
    const notAvailable =
      query.error instanceof ApiError && (query.error.status === 404 || query.error.status === 400)
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
          <h1 className="text-lg font-bold text-foreground">
            {notAvailable ? tGenerated("thisListingIsnTAvailable") : tGenerated("weCouldnTLoadThisListing")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {notAvailable
              ? tGenerated("itMayHaveBeenSoldRemovedOrExpired")
              : tGenerated("pleaseCheckYourConnectionAndTryAgain")}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            {!notAvailable && (
              <Button size="sm" onClick={() => query.refetch()}>
                <LocalizedText id="tryAgain" />
              </Button>
            )}
            <Button size="sm" variant="outline" render={<Link href="/search"><LocalizedText id="browseListings" /></Link>} />
          </div>
        </div>
      </Container>
    )
  }

  const showLoan = isLoanEligible(listing)
  const price = listing.price !== null ? Number(listing.price) : 0
  const relatedRaw = similar.data ?? []
  const relatedIds = new Set(relatedRaw.map((l) => l.id))
  const related = relatedRaw.map(toListingCardData)
  // Only after related has loaded, so a listing is never shown in both sections.
  const moreFromSeller = similar.isFetched
    ? (sellerListings.data ?? [])
        .filter((l) => l.id !== listing.id && !relatedIds.has(l.id))
        .slice(0, MORE_FROM_SELLER_LIMIT)
        .map(toListingCardData)
    : []
  const categoryHref = `/category/${listing.category.breadcrumb
    .map((c) => encodeURIComponent(c.slug))
    .join("/")}`
  const sellerName = listing.seller?.shopName?.trim()
  const hasContacts = (listing.seller?.contacts.length ?? 0) > 0
  const canOffer = !listing.isOwner && listing.price !== null && listing.currency !== null

  const loan = showLoan ? (
    <LoanCalculatorCard price={price} currency={listing.currency ?? "USD"} />
  ) : null

  return (
    <div className="min-h-dvh bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <Container className="py-0 sm:py-4">
        <ListingBreadcrumbs categoryPath={listing.category.breadcrumb} title={listing.title} />

        <div className="mt-0 grid grid-cols-1 items-start gap-2.5 sm:mt-2 sm:gap-3 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-4">
          <div className="-mx-3 min-w-0 overflow-hidden rounded-none border-y border-border/70 bg-card sm:-mx-4 md:mx-0 md:rounded-md md:border lg:col-start-1 lg:row-start-1">
            <ListingGallery
              images={toGalleryImages(listing.media, listing.title)}
              title={listing.title}
              mobileControls={<ListingMobileGalleryControls listing={listing} fallbackHref={categoryHref} />}
            />
            <div className="border-t border-border/60 px-3 py-2.5 sm:px-4 sm:py-3">
              <ListingPrimaryPanel listing={listing} />
            </div>
          </div>

          <div className="space-y-3 lg:col-start-2 lg:row-span-3 lg:row-start-1">
            {listing.seller && (
              <ListingSellerCard
                seller={listing.seller}
                listingId={listing.id}
                isOwner={listing.isOwner}
                mobileOffer={
                  hasContacts && canOffer
                    ? { title: listing.title, price: Number(listing.price), currency: listing.currency! }
                    : null
                }
              />
            )}
            <div className="hidden lg:block">
              <ListingSafetyCard tips={safetyTipText} isLoading={safetyTips.isPending} />
            </div>
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <ListingInfoCard listing={listing} />
          </div>

          {loan && <div className="min-w-0 lg:col-start-1 lg:row-start-3">{loan}</div>}

          <div className="min-w-0 lg:hidden">
            <ListingSafetyCard tips={safetyTipText} isLoading={safetyTips.isPending} />
          </div>
        </div>

        <div className="mt-4 space-y-4 border-t border-border/70 pt-3 sm:mt-6 sm:space-y-5 sm:pt-5">
          <ListingCardsSection
            title={sellerName ? `More from ${sellerName}` : tGenerated("moreFromThisSeller")}
            listings={moreFromSeller}
            viewAllHref={listing.seller ? `/seller/${listing.seller.id}` : undefined}
          />
          <ListingCardsSection title={tGenerated("relatedPosts")} listings={related} viewAllHref={categoryHref} />
        </div>

      </Container>

      <ListingMobileActionBar listing={listing} hasContacts={hasContacts} />
    </div>
  )
}
