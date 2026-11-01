import type { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { ListingDetailContent } from "@/features/listings/components/detail/listing-detail-content"
import { lookupListingMeta } from "@/features/listings/api/listing-detail.server"
import { listingDetailQueryOptions, RELATED_LIMIT } from "@/features/listings/api/listing-detail.queries"
import type { ListingDetail } from "@/features/listings/api/listing-detail.api"
import type { PublicListing } from "@/features/listings/api/listings.api"
import { marketplaceKeys } from "@/lib/query/keys"
import { getAuthCookieHeader, serverApiGet } from "@/lib/api/server-fetch"

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = await lookupListingMeta(slug)

  if (!meta) {
    return { title: "Listing — offerupkh", robots: { index: false, follow: false } }
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: meta.imageUrl ? [{ url: meta.imageUrl }] : [],
    },
  }
}

/**
 * The listing and its related posts are fetched on the server (with the visitor's cookies, so the
 * saved heart and owner controls are right) and handed to React Query: the page arrives with content
 * instead of a skeleton waiting on browser API calls. Failures fall back to client fetching.
 */
export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  const id = encodeURIComponent(slug)
  const cookieHeader = await getAuthCookieHeader()
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      ...listingDetailQueryOptions(slug),
      queryFn: () =>
        serverApiGet<{ listing: ListingDetail }>(`/listings/${id}`, { cookieHeader }).then((data) => data.listing),
    }),
    queryClient.prefetchQuery({
      queryKey: marketplaceKeys.listings.similar(slug),
      queryFn: () =>
        serverApiGet<{ listings: PublicListing[] }>(`/listings/${id}/similar?limit=${RELATED_LIMIT}`, {
          cookieHeader,
        }).then((data) => data.listings),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingDetailContent id={slug} />
    </HydrationBoundary>
  )
}
