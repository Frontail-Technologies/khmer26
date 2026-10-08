"use client"

import { useState } from "react"
import { MapPin } from "@phosphor-icons/react"
import type { ListingDetail } from "../../api/listing-detail.api"
import { formatLocation } from "../../lib/listing-detail-format"
import { ListingMap } from "./listing-map"

interface ListingLocationProps {
  location: ListingDetail["location"]
}

const PRIVACY_NOTE = "Exact location is shared by the seller after contact."

/**
 * Shows a real map of the approximate area when the backend resolved one (commune, district or
 * province centre). Without coordinates, or if the map cannot start, it shows the text location only.
 */
export function ListingLocation({ location }: ListingLocationProps) {
  const [mapFailed, setMapFailed] = useState(false)
  const name = formatLocation(location)
  const map = location.map

  if (!map || mapFailed) {
    return (
      <section aria-label="Location" className="space-y-2.5">
        <h2 className="text-sm sm:text-base font-bold text-foreground">Location</h2>
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin size={17} weight="fill" />
          </span>
          <div className="min-w-0">
            <p className="wrap-break-word text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label="Location" className="space-y-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm sm:text-base font-bold text-foreground">Location</h2>
        <span className="min-w-0 truncate text-xs font-semibold text-primary">{name}</span>
      </div>

      <ListingMap
        latitude={map.latitude}
        longitude={map.longitude}
        precision={map.precision}
        label={name}
        onUnavailable={() => setMapFailed(true)}
      />

      <div>
        <p className="text-xs font-semibold text-foreground">Approximate area</p>
        <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>
      </div>
    </section>
  )
}
