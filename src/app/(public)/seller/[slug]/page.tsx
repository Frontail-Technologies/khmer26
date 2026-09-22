import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SellerBreadcrumbs } from "@/features/sellers/components/seller-breadcrumbs"
import { SellerProfileHeader } from "@/features/sellers/components/seller-profile-header"
import { SellerStats } from "@/features/sellers/components/seller-stats"
import { SellerTabs } from "@/features/sellers/components/seller-tabs"
import {
  getSellerBySlug,
  getSellerListings,
  getSellerReviews,
} from "@/features/sellers/data/demo-sellers"

interface SellerPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: SellerPageProps): Promise<Metadata> {
  const { slug } = await params
  const seller = getSellerBySlug(slug)

  if (!seller) {
    return {
      title: "Seller Not Found — Khmer26",
    }
  }

  return {
    title: `${seller.name} (@${seller.username}) — Khmer26 Seller Profile`,
    description: seller.bio || `${seller.name} is a verified seller on Khmer26 offering ${seller.activeListings} active marketplace listings.`,
    openGraph: {
      title: `${seller.name} (@${seller.username}) — Khmer26`,
      description: seller.bio || `Verified seller in ${seller.location}`,
      images: seller.avatar ? [{ url: seller.avatar }] : [],
    },
  }
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { slug } = await params
  const seller = getSellerBySlug(slug)

  if (!seller) {
    notFound()
  }

  const listings = getSellerListings(seller.slug)
  const reviews = getSellerReviews(seller.slug)

  return (
    <div className="min-h-screen bg-background pb-16">
      <Container className="py-3 sm:py-4">
        <SellerBreadcrumbs sellerName={seller.name} />

        <div className="mt-2 space-y-6">
          <SellerProfileHeader seller={seller} />

          <SellerStats seller={seller} />

          <div className="pt-2">
            <SellerTabs
              seller={seller}
              listings={listings}
              reviews={reviews}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}
