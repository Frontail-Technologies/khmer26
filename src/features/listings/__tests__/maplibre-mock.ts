import { vi } from "vitest"

export interface MapCall {
  options: Record<string, unknown>
  removed: boolean
  controls: unknown[]
  markers: Array<{ lngLat: [number, number] }>
  sources: string[]
  layers: string[]
}

export const mapCalls: MapCall[] = []
export const mapBehavior = { throwOnCreate: false }
export const workerUrls: string[] = []

/** Minimal stand-in for maplibre-gl (jsdom has no WebGL). */
export const maplibreMock = {
  setWorkerUrl(url: string) {
    workerUrls.push(url)
  },
  Map: class {
    call: MapCall
    constructor(options: Record<string, unknown>) {
      if (mapBehavior.throwOnCreate) throw new Error("WebGL is not supported")
      this.call = { options, removed: false, controls: [], markers: [], sources: [], layers: [] }
      mapCalls.push(this.call)
    }
    addControl(control: unknown) {
      this.call.controls.push(control)
    }
    on(event: string, handler: () => void) {
      if (event === "load") handler()
    }
    addSource(id: string) {
      this.call.sources.push(id)
    }
    addLayer(layer: { id: string }) {
      this.call.layers.push(layer.id)
    }
    remove() {
      this.call.removed = true
    }
  },
  NavigationControl: class {
    constructor(public options: unknown) {}
  },
  Marker: class {
    private lngLat: [number, number] = [0, 0]
    constructor(public options: unknown) {}
    setLngLat(lngLat: [number, number]) {
      this.lngLat = lngLat
      return this
    }
    addTo(map: { call: MapCall }) {
      map.call.markers.push({ lngLat: this.lngLat })
      return this
    }
  },
}

export function resetMapMock() {
  mapCalls.length = 0
  workerUrls.length = 0
  mapBehavior.throwOnCreate = false
}

export const noop = vi.fn()
