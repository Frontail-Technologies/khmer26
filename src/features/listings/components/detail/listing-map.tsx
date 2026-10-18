"use client"

import { useTranslations } from "next-intl"

import { useEffect, useRef } from "react"
import "maplibre-gl/dist/maplibre-gl.css"
import {
  MAP_AREA_RADIUS_M,
  MAP_ZOOM,
  TILE_ATTRIBUTION,
  circleRing,
  getTileUrl,
  type MapPrecision,
} from "../../lib/approximate-map"

/** Copied into /public by scripts/copy-maplibre-worker.mjs (see that file for why). */
const WORKER_URL = "/maplibre/maplibre-gl-worker.mjs"

interface ListingMapProps {
  latitude: number
  longitude: number
  precision: MapPrecision
  label: string
  /** Called if the map cannot start (for example no WebGL), so the caller can show the text fallback. */
  onUnavailable?: () => void
}

/**
 * Interactive map of either the seller-provided exact position or an administrative-area centre.
 */
export function ListingMap({ latitude, longitude, precision, label, onUnavailable }: ListingMapProps) {
  const tGenerated = useTranslations("generated")
  const containerRef = useRef<HTMLDivElement>(null)
  const onUnavailableRef = useRef(onUnavailable)
  useEffect(() => {
    onUnavailableRef.current = onUnavailable
  })

  useEffect(() => {
    let cancelled = false
    let map: import("maplibre-gl").Map | undefined

    async function start() {
      try {
        const maplibregl = await import("maplibre-gl")
        maplibregl.setWorkerUrl(WORKER_URL)
        if (cancelled || !containerRef.current) return

        const instance = new maplibregl.Map({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {
              tiles: {
                type: "raster",
                tiles: [getTileUrl()],
                tileSize: 256,
                maxzoom: 19,
                attribution: TILE_ATTRIBUTION,
              },
            },
            layers: [{ id: "tiles", type: "raster", source: "tiles" }],
          },
          center: [longitude, latitude],
          zoom: MAP_ZOOM[precision],
          maxZoom: precision === "exact" ? 19 : 15,
          // Two-finger pan on touch and Ctrl+scroll on desktop, so the page keeps scrolling normally.
          cooperativeGestures: true,
          attributionControl: { compact: true },
        })
        map = instance
        instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")

        instance.on("load", () => {
          if (cancelled) return
          if (precision !== "exact") {
            instance.addSource("area", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [circleRing(latitude, longitude, MAP_AREA_RADIUS_M[precision])],
                },
              },
            })
            instance.addLayer({
              id: "area-fill",
              type: "fill",
              source: "area",
              paint: { "fill-color": "#2563eb", "fill-opacity": 0.14 },
            })
            instance.addLayer({
              id: "area-line",
              type: "line",
              source: "area",
              paint: { "line-color": "#2563eb", "line-width": 2, "line-opacity": 0.7 },
            })
          }
        })

        new maplibregl.Marker({ color: "#2563eb" }).setLngLat([longitude, latitude]).addTo(instance)
      } catch {
        if (!cancelled) onUnavailableRef.current?.()
      }
    }

    void start()
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [latitude, longitude, precision])

  return (
    <div className="relative overflow-hidden rounded-md border border-border/70 bg-muted/50">
      <div
        ref={containerRef}
        role="region"
        aria-label={precision === "exact" ? `Map of the exact location: ${label}` : `Map of the approximate area: ${label}`}
        className="h-44 w-full sm:h-32"
      />
      <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-background/90 px-2 py-0.5 text-xxs font-semibold text-foreground shadow-xs">
        {precision === "exact" ? tGenerated("exactLocation") : tGenerated("approximateArea_03dbb4")}
      </span>
    </div>
  )
}
