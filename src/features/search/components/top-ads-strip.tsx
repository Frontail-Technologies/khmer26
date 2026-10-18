"use client"

import { useTranslations } from "next-intl"
import { ListingCard } from "@/features/listings/components/listing-card"
import type { ListingCardData } from "@/types"

/** Promoted listings shown above the results; they are left out of the main list. */
export function TopAdsStrip({ listings }: { listings: ListingCardData[] }) {
  const t = useTranslations("ui.topAds")
  if (listings.length === 0) return null

  return (
    <section aria-label={t("title")} className="mb-4 rounded-xl bg-primary/10 p-3 sm:p-4">
      <h2 className="mb-3 text-base font-bold text-foreground">{t("title")}</h2>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {listings.map((listing) => (
          <div key={listing.id} className="w-44 shrink-0 snap-start sm:w-52 lg:w-60">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </section>
  )
}
