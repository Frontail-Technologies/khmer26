"use client"

import { useLocale, useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { ArrowSquareOut, MapPin } from "@phosphor-icons/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ListingDetail } from "../../api/listing-detail.api"
import { formatLocation } from "../../lib/listing-detail-format"
import { ListingMap } from "./listing-map"

interface ListingLocationProps {
  location: ListingDetail["location"]
}

const PRIVACY_NOTE = "Exact location is shared by the seller after contact."

/**
 * Location row (icon + commune, district, province) and, when the backend resolved one, a compact
 * real map of the approximate area. Without coordinates, or if the map cannot start, only the
 * text location is shown.
 */
export function ListingLocation({ location }: ListingLocationProps) {
  const tGenerated = useTranslations("generated")
  const locale = useLocale()
  const [mapFailed, setMapFailed] = useState(false)
  const name = formatLocation(location, locale)
  const map = location.map
  const showMap = Boolean(map) && !mapFailed

  return (
    <section aria-label={tGenerated("location")} className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin size={16} weight="fill" className="shrink-0 text-primary" />
        <p className="min-w-0 wrap-break-word text-sm font-semibold text-foreground">{name}</p>
      </div>

      {showMap && map && (
        <ListingMap
          latitude={map.latitude}
          longitude={map.longitude}
          precision={map.precision}
          label={name}
          onUnavailable={() => setMapFailed(true)}
        />
      )}

      {location.googleMapsUrl && (
        <a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9")}
        >
          <MapPin size={16} weight="fill" />
          <LocalizedText id="openInGoogleMaps" />
          <ArrowSquareOut size={14} />
        </a>
      )}

      <p className="text-xs text-muted-foreground">
        {showMap && map?.precision !== "exact" && <span className="font-semibold text-foreground"><LocalizedText id="approximateArea" /> </span>}
        {map?.precision === "exact" || location.googleMapsUrl ? tGenerated("exactLocationProvidedByTheSeller") : PRIVACY_NOTE}
      </p>
    </section>
  )
}
