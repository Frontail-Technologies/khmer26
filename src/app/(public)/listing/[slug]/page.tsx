import type { Metadata } from "next"
import { ListingDetailContent } from "@/features/listings/components/detail/listing-detail-content"
import { lookupListingMeta } from "@/features/listings/api/listing-detail.server"

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = await lookupListingMeta(slug)

  if (!meta) {
    return { title: "Listing — Khmer26" }
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

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  return <ListingDetailContent id={slug} />
}
