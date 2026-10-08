"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/layout/Container"
import { MobilePageHeader } from "@/components/shared/mobile-page-header"
import { ApiError } from "@/lib/api/client"
import { useSeller, useSellerListingsInfinite } from "../api/sellers.queries"
import { SellerBreadcrumbs } from "./seller-breadcrumbs"
import { SellerProfileHeader } from "./seller-profile-header"
import { SellerTabs } from "./seller-tabs"

function ProfileSkeleton() {
  return (
    <Container className="py-3 sm:py-4">
      <div aria-busy="true" aria-label="Loading seller" className="mt-2 space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-11 w-64 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/5 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </Container>
  )
}

export function SellerProfileContent({ id }: { id: string }) {
  const query = useSeller(id)
  const seller = query.data
  // Shares the cache entry with the listings tab; chat can only start from a public listing.
  const listings = useSellerListingsInfinite(seller?.id ?? "", Boolean(seller))

  if (query.isPending) return <ProfileSkeleton />

  if (query.isError || !seller) {
    const notAvailable =
      query.error instanceof ApiError && (query.error.status === 404 || query.error.status === 400)
    return (
      <Container className="py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
          <h1 className="text-lg font-bold text-foreground">
            {notAvailable ? "This seller isn't available" : "We couldn't load this seller"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {notAvailable
              ? "The profile may have been removed or doesn't exist."
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

  const contactListingId = listings.data?.pages[0]?.items[0]?.id ?? null

  return (
    <div className="min-h-dvh bg-background pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-16">
      <MobilePageHeader backHref="/search" backLabel="Back to marketplace" title={seller.shopName} />
      <Container className="py-3 sm:py-4">
        <SellerBreadcrumbs sellerName={seller.shopName} />

        <div className="mt-2 space-y-6">
          <SellerProfileHeader
            seller={seller}
            contactListingId={contactListingId}
            isOwnProfile={seller.isOwner}
          />
          <SellerTabs seller={seller} isOwnProfile={seller.isOwner} />
        </div>
      </Container>
    </div>
  )
}
