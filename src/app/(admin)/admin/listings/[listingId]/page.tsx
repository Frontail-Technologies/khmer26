import type { Metadata } from "next"
import { ListingDetailWorkspace } from "@/features/admin/listings/components/listing-detail-workspace"

interface AdminListingDetailPageProps {
  params: Promise<{ listingId: string }>
}

export async function generateMetadata({
  params,
}: AdminListingDetailPageProps): Promise<Metadata> {
  const { listingId } = await params
  return {
    title: `Listing Review #${listingId}`,
    description: `Administrative listing moderation workspace for listing #${listingId}`,
  }
}

export default async function AdminListingDetailPage({
  params,
}: AdminListingDetailPageProps) {
  const { listingId } = await params

  return <ListingDetailWorkspace listingId={listingId} />
}
