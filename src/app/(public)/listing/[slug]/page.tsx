import type { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { ListingDetailContent } from "@/features/listings/components/detail/listing-detail-content"
import { lookupListingMeta } from "@/features/listings/api/listing-detail.server"
import { listingDetailQueryOptions } from "@/features/listings/api/listing-detail.queries"
import type { ListingDetail } from "@/features/listings/api/listing-detail.api"
import { getAuthCookieHeader, isClientNavigation, serverApiGet } from "@/lib/api/server-fetch"

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
 * On a full page load the listing is fetched on the server (with the visitor's cookies, so the
 * saved heart and owner controls are right) and handed to React Query: the page arrives with content
 * instead of a skeleton waiting on browser API calls. Failures fall back to client fetching.
 * In-app navigations skip the server round trip to the API: the page opens immediately and renders
 * from the client cache (warmed when the card was hovered or touched) or its own fetch.
 */
export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  if (await isClientNavigation()) return <ListingDetailContent id={slug} />

  const id = encodeURIComponent(slug)
  const cookieHeader = await getAuthCookieHeader()
  const queryClient = new QueryClient()

  // Only the listing blocks the HTML; related posts load in the browser so they never hold the page back.
  await queryClient.prefetchQuery({
    ...listingDetailQueryOptions(slug),
    queryFn: () =>
      serverApiGet<{ listing: ListingDetail }>(`/listings/${id}`, { cookieHeader }).then((data) => data.listing),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingDetailContent id={slug} />
    </HydrationBoundary>
  )
}
