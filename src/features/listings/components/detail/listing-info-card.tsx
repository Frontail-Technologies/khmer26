import { Card, CardContent } from "@/components/ui/card"
import type { ListingDetail } from "../../api/listing-detail.api"
import { ListingSpecifications } from "./listing-specifications"
import { ListingDescription } from "./listing-description"
import { ListingLocation } from "./listing-location"

/** Details, description and location in one card instead of three separate ones. */
export function ListingInfoCard({ listing }: { listing: ListingDetail }) {
  const hasDescription = Boolean(listing.description?.trim())

  return (
    <Card size="sm">
      <CardContent className="divide-y divide-border/60 pt-(--card-spacing) [&>div]:py-4 [&>div:first-child]:pt-0 [&>div:last-child]:pb-0">
        <div>
          <ListingSpecifications listing={listing} />
        </div>
        {hasDescription && (
          <div>
            <ListingDescription description={listing.description} />
          </div>
        )}
        <div>
          <ListingLocation location={listing.location} />
        </div>
      </CardContent>
    </Card>
  )
}
