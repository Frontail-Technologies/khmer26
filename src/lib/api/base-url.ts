/** Port the API listens on by default (apps/api/src/config/env.ts). Override with NEXT_PUBLIC_API_URL. */
const DEFAULT_API_PORT = 3001

/**
 * The one place that decides where the API lives. In the browser without configuration it follows
 * the page's own host, so opening the site from another device or hostname still works.
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_API_PORT}/api/v1`
  }
  return `http://localhost:${DEFAULT_API_PORT}/api/v1`
}
