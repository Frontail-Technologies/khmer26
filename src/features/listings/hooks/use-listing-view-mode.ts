"use client"

import { createContext, createElement, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react"
import type { ListingViewMode } from "../components/listing-view-toggle"
import { parseViewMode, VIEW_MODE_COOKIE } from "../lib/view-mode"

/**
 * The grid/list choice lives in a cookie so the server renders the visitor's mode in the first HTML
 * (no grid-then-list flash on refresh). localStorage is kept as a fallback for visitors who chose a
 * mode before the cookie existed; their choice is copied into the cookie on first read.
 */
const STORAGE_KEY = "khmer26_listing_view_mode"
const CHANGE_EVENT = "khmer26_view_mode_change"

const InitialViewModeContext = createContext<ListingViewMode>("grid")

export function ListingViewModeProvider({ initialMode, children }: { initialMode: ListingViewMode; children: ReactNode }) {
  return createElement(InitialViewModeContext.Provider, { value: initialMode }, children)
}

function readCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VIEW_MODE_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(mode: ListingViewMode) {
  document.cookie = `${VIEW_MODE_COOKIE}=${mode}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

function getSnapshot(): ListingViewMode {
  try {
    const cookie = readCookie()
    if (cookie) return parseViewMode(cookie)
    const legacy = localStorage.getItem(STORAGE_KEY)
    if (legacy === "list" || legacy === "grid") writeCookie(legacy)
    return parseViewMode(legacy)
  } catch {
    return "grid"
  }
}

export function useListingViewMode() {
  const initial = useContext(InitialViewModeContext)
  const mode = useSyncExternalStore(subscribe, getSnapshot, () => initial)

  const setMode = useCallback((nextMode: ListingViewMode) => {
    try {
      writeCookie(nextMode)
      localStorage.setItem(STORAGE_KEY, nextMode)
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return [mode, setMode] as const
}
