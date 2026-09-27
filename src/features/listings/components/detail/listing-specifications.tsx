import { ListBullets } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ListingDetail } from "@/types"

interface ListingSpecificationsProps {
  listing: ListingDetail
}

export function ListingSpecifications({ listing }: ListingSpecificationsProps) {
  const rows: Array<{ label: string; value: string }> = []

  if (listing.condition) {
    rows.push({
      label: "Condition",
      value: listing.condition.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    })
  }

  if (listing.brand) {
    rows.push({ label: "Brand", value: listing.brand })
  }

  if (listing.year) {
    rows.push({ label: "Year", value: String(listing.year) })
  }

  if (listing.mileage) {
    rows.push({ label: "Mileage", value: `${listing.mileage.toLocaleString()} km` })
  }

  if (listing.fuel) {
    rows.push({ label: "Fuel Type", value: listing.fuel })
  }

  if (listing.transmission) {
    rows.push({ label: "Transmission", value: listing.transmission })
  }

  if (listing.categoryPath && listing.categoryPath.length > 0) {
    rows.push({
      label: "Category",
      value: listing.categoryPath[listing.categoryPath.length - 1],
    })
  }

  if (listing.attributes && listing.attributes.length > 0) {
    listing.attributes.forEach((attr) => {
      if (attr.label && attr.value && !rows.some((r) => r.label.toLowerCase() === attr.label.toLowerCase())) {
        rows.push({ label: attr.label, value: attr.value })
      }
    })
  }

  if (rows.length === 0) {
    return null
  }

  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <ListBullets size={18} className="text-primary shrink-0" />
        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
          Listing Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rows.map((row, idx) => (
            <div
              key={`${row.label}-${idx}`}
              className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <span className="text-xs text-muted-foreground font-medium truncate">
                {row.label}
              </span>
              <span className="text-xs font-bold text-foreground text-right pl-3 truncate">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
