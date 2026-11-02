"use client"

import { useSyncExternalStore } from "react"

/** What the home page actually showed, top to bottom, so the skeleton can draw the same shape. */
export type HomeSkeletonBlock = "categories" | "banner" | "listings"

const STORAGE_KEY = "k26_home_layout"
const DEFAULT_LAYOUT: HomeSkeletonBlock[] = ["categories", "banner", "listings"]
const VALID = new Set<HomeSkeletonBlock>(["categories", "banner", "listings"])

let cachedRaw: string | null | undefined
let cachedLayout: HomeSkeletonBlock[] = DEFAULT_LAYOUT

function read(): HomeSkeletonBlock[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {}
  if (raw === cachedRaw) return cachedLayout
  cachedRaw = raw
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    const blocks = Array.isArray(parsed) ? parsed.filter((b): b is HomeSkeletonBlock => VALID.has(b)) : []
    cachedLayout = blocks.length > 0 ? blocks : DEFAULT_LAYOUT
  } catch {
    cachedLayout = DEFAULT_LAYOUT
  }
  return cachedLayout
}

/** Remember the rendered layout (admins configure home sections, so it differs per site). */
export function rememberHomeLayout(blocks: HomeSkeletonBlock[]) {
  try {
    const next = JSON.stringify(blocks.slice(0, 4))
    if (localStorage.getItem(STORAGE_KEY) !== next) localStorage.setItem(STORAGE_KEY, next)
  } catch {}
}

const noopSubscribe = () => () => {}

export function useRememberedHomeLayout(): HomeSkeletonBlock[] {
  return useSyncExternalStore(noopSubscribe, read, () => DEFAULT_LAYOUT)
}
