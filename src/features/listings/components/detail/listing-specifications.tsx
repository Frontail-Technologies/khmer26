import type { ListingDetail } from "../../api/listing-detail.api"
import { formatSpecValue } from "../../lib/listing-detail-format"

interface ListingSpecificationsProps {
  listing: Pick<ListingDetail, "specs" | "category">
}

/** Backend dynamic specs in a compact label-over-value grid. Nothing is assumed per category. */
export function ListingSpecifications({ listing }: ListingSpecificationsProps) {
  const rows = [
    { key: "category", label: "Category", value: listing.category.nameEn },
    ...listing.specs.map((spec) => ({
      key: spec.fieldId,
      label: spec.labelEn,
      value: formatSpecValue(spec),
    })),
  ]

  // Only the category is known: a single slim line instead of a mostly empty block.
  if (rows.length === 1) {
    return (
      <p className="text-sm text-muted-foreground">
        <span>{rows[0]!.label}: </span>
        <span className="font-semibold text-foreground">{rows[0]!.value}</span>
      </p>
    )
  }

  return (
    <section aria-label="Listing details" className="space-y-3">
      <h2 className="text-sm sm:text-base font-bold text-foreground">Listing Details</h2>
      <dl
        className={`grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 ${
          rows.length >= 4 ? "xl:grid-cols-4" : ""
        }`}
      >
        {rows.map((row) => (
          <div key={row.key} className="min-w-0">
            <dt className="truncate text-[11px] font-medium text-muted-foreground">{row.label}</dt>
            <dd className="wrap-break-word text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
