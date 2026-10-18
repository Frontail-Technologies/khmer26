import { useLocale, useTranslations } from "next-intl"
import type { ListingDetail } from "../../api/listing-detail.api"
import { formatSpecValue } from "../../lib/listing-detail-format"

interface ListingSpecificationsProps {
  listing: Pick<ListingDetail, "specs"> & { category: Pick<ListingDetail["category"], "nameEn" | "nameKm" | "breadcrumb"> }
}

/** Category levels from the real ancestry: root = Main Category, last = Category, any between = Sub Category. */
const DEFAULT_ROW_LABELS = { main: "Main Category", sub: "Sub Category", category: "Category" }

export function categoryRows(
  category: ListingSpecificationsProps["listing"]["category"],
  locale = "en",
  labels: typeof DEFAULT_ROW_LABELS = DEFAULT_ROW_LABELS
) {
  const name = (item: { nameEn: string; nameKm: string | null }) => locale === "km" && item.nameKm?.trim() ? item.nameKm : item.nameEn
  const trail = category.breadcrumb.length > 0 ? category.breadcrumb.map(name) : [name(category)]
  if (trail.length === 1) return [{ key: "category", label: labels.category, value: trail[0]! }]

  const rows = [{ key: "main", label: labels.main, value: trail[0]! }]
  const middle = trail.slice(1, -1)
  if (middle.length > 0) rows.push({ key: "sub", label: labels.sub, value: middle.join(" › ") })
  rows.push({ key: "category", label: labels.category, value: trail[trail.length - 1]! })
  return rows
}

/**
 * Category levels plus the backend's dynamic specs as compact label-over-value pairs.
 * Nothing is assumed per category.
 */
export function ListingSpecifications({ listing }: ListingSpecificationsProps) {
  const tGenerated = useTranslations("generated")
  const tUi = useTranslations("ui.listings")
  const locale = useLocale()
  const rows = [
    ...categoryRows(listing.category, locale, {
      main: tUi("specMainCategory"),
      sub: tUi("specSubCategory"),
      category: tUi("specCategory"),
    }),
    ...listing.specs.map((spec) => ({
      key: spec.fieldId,
      label: locale === "km" && spec.labelKm?.trim() ? spec.labelKm : spec.labelEn,
      value: formatSpecValue(spec, locale),
    })),
  ]

  return (
    <section aria-label={tGenerated("listingDetails")}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
        {rows.map((row) => (
          <div key={row.key} className="min-w-0">
            <dt className="truncate text-xxs font-medium text-muted-foreground">{row.label}</dt>
            <dd className="wrap-break-word text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
