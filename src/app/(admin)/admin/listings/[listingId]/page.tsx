import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Tag } from "@phosphor-icons/react/dist/ssr"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ListingAdminGallery } from "@/features/admin/listings/components/listing-admin-gallery"
import { ListingInformation } from "@/features/admin/listings/components/listing-information"
import { ListingSpecifications } from "@/features/admin/listings/components/listing-specifications"
import { ListingSellerSummary } from "@/features/admin/listings/components/listing-seller-summary"
import { ListingReports } from "@/features/admin/listings/components/listing-reports"
import { ListingModerationHistory } from "@/features/admin/listings/components/listing-moderation-history"
import { ListingModerationPanel } from "@/features/admin/listings/components/listing-moderation-panel"
import { DEMO_ADMIN_LISTINGS } from "@/features/admin/listings/data/demo-admin-listings"
import type { AdminListingStatus } from "@/features/admin/listings/types"

interface AdminListingDetailPageProps {
  params: Promise<{ listingId: string }>
}

const STATUS_TONE_MAP: Record<AdminListingStatus, StatusTone> = {
  pending: "warning",
  flagged: "destructive",
  active: "success",
  sold: "neutral",
  expired: "neutral",
  rejected: "destructive",
  removed: "destructive",
  draft: "neutral",
}

const STATUS_LABEL_MAP: Record<AdminListingStatus, string> = {
  pending: "Pending Review",
  flagged: "Flagged for Review",
  active: "Active",
  sold: "Sold",
  expired: "Expired",
  rejected: "Rejected",
  removed: "Removed",
  draft: "Draft",
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

  const listing =
    DEMO_ADMIN_LISTINGS.find((l) => l.id.toLowerCase() === listingId.toLowerCase()) ||
    DEMO_ADMIN_LISTINGS[0]

  if (!listing) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1">
          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-0.5"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Listings</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Tag size={16} weight="fill" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-mono">
                {listing.id}
              </h1>
            </div>

            <StatusBadge
              label={STATUS_LABEL_MAP[listing.status]}
              tone={STATUS_TONE_MAP[listing.status]}
              size="sm"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Submitted {listing.createdDate} by <span className="font-semibold text-foreground">{listing.seller.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <ListingAdminGallery images={listing.images} title={listing.title} />

          <ListingInformation listing={listing} />

          <ListingSpecifications specifications={listing.specifications} />

          <ListingSellerSummary seller={listing.seller} />

          <ListingReports reports={listing.reports} />

          <ListingModerationHistory history={listing.history} />
        </div>

        <div className="lg:col-span-4">
          <ListingModerationPanel listing={listing} />
        </div>
      </div>
    </div>
  )
}
