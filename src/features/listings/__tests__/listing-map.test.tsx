import { describe, expect, it, vi, beforeEach } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { makeDetail } from "./detail-fixtures"
import { mapBehavior, mapCalls, resetMapMock, workerUrls } from "./maplibre-mock"

vi.mock("maplibre-gl", async () => (await import("./maplibre-mock")).maplibreMock)
vi.mock("maplibre-gl/dist/maplibre-gl.css", () => ({}))

import { ListingLocation } from "../components/detail/listing-location"
import {
  DEFAULT_TILE_URL,
  MAP_AREA_RADIUS_M,
  MAP_ZOOM,
  circleRing,
  getTileUrl,
} from "../lib/approximate-map"

const location = (map: ReturnType<typeof makeDetail>["location"]["map"]) => ({
  ...makeDetail().location,
  map,
})

describe("<ListingLocation /> approximate map", () => {
  beforeEach(() => resetMapMock())

  it("renders a real map centred on the backend-resolved area, with the privacy copy", async () => {
    renderWithProviders(
      <ListingLocation location={location({ latitude: 11.537307, longitude: 104.920877, precision: "district" })} />
    )

    expect(await screen.findByRole("region", { name: /Map of the approximate area/ })).toBeInTheDocument()
    await waitFor(() => expect(mapCalls).toHaveLength(1))

    const call = mapCalls[0]!
    expect(call.options.center).toEqual([104.920877, 11.537307])
    expect(call.options.zoom).toBe(MAP_ZOOM.district)
    expect(call.options.cooperativeGestures).toBe(true)
    expect(workerUrls).toEqual(["/maplibre/maplibre-gl-worker.mjs"])
    expect(call.markers).toEqual([{ lngLat: [104.920877, 11.537307] }])
    expect(call.controls).toHaveLength(1)
    expect(call.sources).toEqual(["area"])
    expect(call.layers).toEqual(["area-fill", "area-line"])

    expect(screen.getAllByText("Approximate area").length).toBeGreaterThan(0)
    expect(screen.getByText("Exact location is shared by the seller after contact.")).toBeInTheDocument()
    expect(screen.getAllByText("Chamkarmon, Phnom Penh").length).toBeGreaterThan(0)
  })

  it("uses a wider zoom for coarser precision and never street-level zoom", () => {
    expect(MAP_ZOOM.commune).toBeGreaterThan(MAP_ZOOM.district)
    expect(MAP_ZOOM.district).toBeGreaterThan(MAP_ZOOM.province)
    expect(MAP_ZOOM.commune).toBeLessThan(15)
    expect(MAP_AREA_RADIUS_M.province).toBeGreaterThan(MAP_AREA_RADIUS_M.district)
    expect(MAP_AREA_RADIUS_M.district).toBeGreaterThan(MAP_AREA_RADIUS_M.commune)
  })

  it("applies the zoom that matches each precision", async () => {
    const { unmount } = renderWithProviders(
      <ListingLocation location={location({ latitude: 13.3, longitude: 103.8, precision: "province" })} />
    )
    await waitFor(() => expect(mapCalls).toHaveLength(1))
    expect(mapCalls[0]!.options.zoom).toBe(MAP_ZOOM.province)
    unmount()
    expect(mapCalls[0]!.removed).toBe(true)

    renderWithProviders(
      <ListingLocation location={location({ latitude: 11.5, longitude: 104.9, precision: "commune" })} />
    )
    await waitFor(() => expect(mapCalls).toHaveLength(2))
    expect(mapCalls[1]!.options.zoom).toBe(MAP_ZOOM.commune)
  })

  it("shows the compact text location, with no map at all, when there are no coordinates", () => {
    const { container } = renderWithProviders(<ListingLocation location={location(null)} />)

    expect(screen.getByText("Chamkarmon, Phnom Penh")).toBeInTheDocument()
    expect(screen.getByText("Exact location is shared by the seller after contact.")).toBeInTheDocument()
    expect(screen.queryByRole("region", { name: /Map/ })).toBeNull()
    expect(screen.queryByText("Approximate area")).toBeNull()
    expect(container.querySelector('[class*="radial-gradient"]')).toBeNull()
    expect(mapCalls).toHaveLength(0)
  })

  it("falls back to the text location if the map cannot start", async () => {
    mapBehavior.throwOnCreate = true
    renderWithProviders(
      <ListingLocation location={location({ latitude: 11.5, longitude: 104.9, precision: "district" })} />
    )

    await waitFor(() => expect(screen.queryByRole("region", { name: /Map/ })).toBeNull())
    expect(screen.getByText("Chamkarmon, Phnom Penh")).toBeInTheDocument()
    expect(screen.getByText("Exact location is shared by the seller after contact.")).toBeInTheDocument()
  })
})

describe("approximate map helpers", () => {
  it("uses OpenStreetMap tiles unless a tile URL is configured", () => {
    expect(DEFAULT_TILE_URL).toContain("tile.openstreetmap.org")
    expect(getTileUrl()).toContain("{z}/{x}/{y}")
  })

  it("draws a closed ring around the centre at roughly the requested radius", () => {
    const ring = circleRing(11.5, 104.9, 4000)
    expect(ring[0]).toEqual(ring[ring.length - 1])
    expect(ring).toHaveLength(65)
    const [lon, lat] = ring[16]!
    const metresNorth = (lat - 11.5) * 111_320
    expect(Math.abs(metresNorth)).toBeGreaterThan(3900)
    expect(Math.abs(metresNorth)).toBeLessThan(4100)
    expect(Math.abs(lon - 104.9)).toBeLessThan(0.001)
  })
})
