import { cookies } from "next/headers"
import { getApiBaseUrl } from "@/lib/api/base-url"

const AUTH_COOKIE_NAMES = ["k26_access_dev", "__Host-k26_access", "k26_session_dev", "__Secure-k26_session"]

/**
 * The visitor's auth cookies as a Cookie header for API calls made during server rendering,
 * or null for guests. Only auth cookies are forwarded.
 */
export async function getAuthCookieHeader(): Promise<string | null> {
  const store = await cookies()
  const pairs = store
    .getAll()
    .filter(({ name }) => AUTH_COOKIE_NAMES.includes(name))
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
  return pairs.length > 0 ? pairs.join("; ") : null
}

interface ServerApiOptions {
  /** Forwarded so the API can personalise (favorites, ownership). Personalised responses are never cached. */
  cookieHeader?: string | null
  /** Seconds the shared (guest) response may be reused by the Next.js data cache. */
  revalidate?: number
  /** Give up and let the browser fetch instead, so a slow API never holds the page hostage. */
  timeoutMs?: number
}

/**
 * GET an API envelope (`{ success, data }`) during server rendering and return `data`.
 * Throws on any failure; callers prefetch into React Query, which simply skips failed queries
 * (the client then fetches as before).
 */
export async function serverApiGet<T>(path: string, options: ServerApiOptions = {}): Promise<T> {
  const { cookieHeader, revalidate = 30, timeoutMs = 2500 } = options
  const url = `${getApiBaseUrl().replace(/\/$/, "")}${path}`
  const personalised = Boolean(cookieHeader)
  const response = await fetch(url, {
    headers: { Accept: "application/json", ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
    signal: AbortSignal.timeout(timeoutMs),
    ...(personalised ? { cache: "no-store" as const } : { next: { revalidate } }),
  })
  if (!response.ok) throw new Error(`API ${path} responded ${response.status}`)
  const payload = (await response.json()) as { success?: boolean; data?: T }
  if (!payload.success || payload.data === undefined) throw new Error(`API ${path} returned an invalid envelope`)
  return payload.data
}
