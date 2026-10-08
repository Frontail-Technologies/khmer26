"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/Container"
import { MobilePageHeader } from "@/components/shared/mobile-page-header"
import { ApiError } from "@/lib/api/client"
import { toListingCardData } from "@/features/listings/lib/to-listing-card-data"
import {
  useListingDetail,
  useSellerListings,
  useSimilarListings,
} from "../../api/listing-detail.queries"
import { toGalleryImages } from "../../lib/listing-detail-format"
import { isLoanEligible } from "../../lib/loan-eligibility"
import { ListingBreadcrumbs } from "./listing-breadcrumbs"
import { ListingGallery } from "./listing-gallery"
import { ListingPrimaryPanel } from "./listing-primary-panel"
import { ListingSellerCard } from "./listing-seller-card"
import { ListingInfoCard } from "./listing-info-card"
import { ListingSafetyCard } from "./listing-safety-card"
import { ListingCardsSection } from "./listing-cards-section"
import { ListingMobileActionBar } from "./listing-mobile-action-bar"
import { LoanCalculatorCard } from "./loan-calculator/loan-calculator-card"

const MORE_FROM_SELLER_LIMIT = 4

function DetailSkeleton() {
  return (
    <Container className="py-3 sm:py-4">
      <div
        aria-busy="true"
        aria-label="Loading listing"
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
  const query = useListingDetail(id)
  const listing = query.data
  const similar = useSimilarListings(id, Boolean(listing))
  const sellerListings = useSellerListings(listing?.seller?.id, Boolean(listing))

  if (query.isPending) return <DetailSkeleton />

  if (query.isError || !listing) {
    const notAvailable =
      query.error instanceof ApiError && (query.error.status === 404 || query.error.status === 400)
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
          <h1 className="text-lg font-bold text-foreground">
            {notAvailable ? "This listing isn't available" : "We couldn't load this listing"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {notAvailable
              ? "It may have been sold, removed or expired."
              : "Please check your connection and try again."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            {!notAvailable && (
              <Button size="sm" onClick={() => query.refetch()}>
                Try again
              </Button>
            )}
            <Button size="sm" variant="outline" render={<Link href="/search">Browse listings</Link>} />
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

  const loan = showLoan ? (
    <LoanCalculatorCard price={price} currency={listing.currency ?? "USD"} />
  ) : null

  return (
    <div className="min-h-dvh bg-background pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <MobilePageHeader
        backHref="/search"
        backLabel="Back to search results"
        title={listing.title}
      />
      <Container className="py-3 sm:py-4">
        <ListingBreadcrumbs categoryPath={listing.category.breadcrumb} title={listing.title} />

        <div className="mt-2 grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 space-y-4 lg:col-span-8">
            <ListingGallery
              images={toGalleryImages(listing.media, listing.title)}
              title={listing.title}
            />

            <div className="space-y-4 lg:hidden">
              <ListingPrimaryPanel listing={listing} />
              {listing.seller && <ListingSellerCard seller={listing.seller} />}
            </div>

            <ListingInfoCard listing={listing} />

            {loan && <div className="lg:hidden">{loan}</div>}

            <div className="lg:hidden">
              <ListingSafetyCard />
            </div>
          </div>

          <div className="hidden space-y-4 lg:sticky lg:top-20 lg:col-span-4 lg:block">
            <ListingPrimaryPanel listing={listing} />
            {listing.seller && <ListingSellerCard seller={listing.seller} />}
            {loan}
            <ListingSafetyCard />
          </div>
        </div>

        <div className="mt-8 space-y-8 border-t border-border/70 pt-6 sm:mt-10 sm:pt-8">
          <ListingCardsSection
            title={sellerName ? `More from ${sellerName}` : "More from this seller"}
            listings={moreFromSeller}
            viewAllHref={listing.seller ? `/seller/${listing.seller.id}` : undefined}
          />
          <ListingCardsSection title="Related listings" listings={related} viewAllHref={categoryHref} />
        </div>
      </Container>

      <ListingMobileActionBar listing={listing} />
    </div>
  )
}
