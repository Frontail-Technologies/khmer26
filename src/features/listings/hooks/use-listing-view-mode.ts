"use client"

import { useSyncExternalStore, useCallback } from "react"
import type { ListingViewMode } from "../components/listing-view-toggle"

const STORAGE_KEY = "khmer26_listing_view_mode"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("khmer26_view_mode_change", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("khmer26_view_mode_change", callback)
  }
}

function getSnapshot(): ListingViewMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === "list" ? "list" : "grid"
  } catch {
    return "grid"
  }
}

function getServerSnapshot(): ListingViewMode {
  return "grid"
}

export function useListingViewMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setMode = useCallback((nextMode: ListingViewMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, nextMode)
      window.dispatchEvent(new Event("khmer26_view_mode_change"))
    } catch {}
  }, [])

  return [mode, setMode] as const
}
