import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MobilePageHeader } from "@/components/shared/mobile-page-header"
import { Container } from "@/components/layout/Container"
import { ListingBreadcrumbs } from "@/features/listings/components/detail/listing-breadcrumbs"
import { ListingGallery } from "@/features/listings/components/detail/listing-gallery"
import { ListingPrimaryPanel } from "@/features/listings/components/detail/listing-primary-panel"
import { ListingSellerCard } from "@/features/listings/components/detail/listing-seller-card"
import { ListingSpecifications } from "@/features/listings/components/detail/listing-specifications"
import { ListingDescription } from "@/features/listings/components/detail/listing-description"
import { ListingLocation } from "@/features/listings/components/detail/listing-location"
import { ListingSafetyCard } from "@/features/listings/components/detail/listing-safety-card"
import { ListingMobileActionBar } from "@/features/listings/components/detail/listing-mobile-action-bar"
import { ListingSection } from "@/features/listings/components/listing-section"
import {
  getListingBySlug,
  getSimilarListings,
} from "@/features/listings/data/demo-listings-detail"

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params
  const listing = getListingBySlug(slug)

  if (!listing) {
    return {
      title: "Listing Not Found — Khmer26",
    }
  }

  const priceFormatted =
    listing.currency === "USD"
      ? `$${listing.price.toLocaleString("en-US")}`
      : `${listing.price.toLocaleString("en-US")} ${listing.currency}`

  return {
    title: `${listing.title} — ${priceFormatted}`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.title} — ${priceFormatted}`,
      description: listing.description.slice(0, 160),
      images: listing.images[0]?.url ? [{ url: listing.images[0].url }] : [],
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  const listing = getListingBySlug(slug)

  if (!listing) {
    notFound()
  }

  const similarListings = getSimilarListings(listing.slug, 5)

  return (
    <div className="min-h-dvh bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-12">
      <MobilePageHeader
        backHref="/search"
        backLabel="Back to search results"
        title={listing.title}
      />
      <Container className="py-3 sm:py-4">
        <ListingBreadcrumbs
          categoryPath={listing.categoryPath}
          title={listing.title}
        />

        <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            <div className="block lg:hidden space-y-4">
              <ListingPrimaryPanel listing={listing} />
              <ListingSellerCard seller={listing.seller} />
            </div>

            <ListingSpecifications attributes={listing.attributes || []} />

            <ListingDescription description={listing.description} />

            <ListingLocation location={listing.location} />

            <div className="block lg:hidden">
              <ListingSafetyCard />
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            <ListingPrimaryPanel listing={listing} />
            <ListingSellerCard seller={listing.seller} />
            <ListingSafetyCard />
          </div>
        </div>

        {similarListings.length > 0 && (
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border/70">
            <ListingSection
              title="Similar Listings"
              description="More items you might be interested in"
              listings={similarListings}
              viewAllHref="/search"
            />
          </div>
        )}
      </Container>

      <ListingMobileActionBar
        listingId={listing.id}
        sellerPhone={listing.seller?.phone}
      />
    </div>
  )
}
