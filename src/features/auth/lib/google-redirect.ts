/**
 * Google sign-in by full-page redirect (OAuth 2.0 token flow), with no Google script, widget or popup.
 *
 * The button sends the browser to Google's consent page; Google sends it back to
 * /auth/google/callback with an access token in the URL fragment. The fragment never reaches any
 * server, and the API verifies the token was issued to our client id before signing anyone in.
 *
 * Google Cloud Console must list `${origin}/auth/google/callback` under "Authorized redirect URIs"
 * for each origin (production and localhost). Production always uses the bare domain (see
 * callbackOrigin), so only https://offerupkh.com/auth/google/callback is needed there.
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const STORAGE_KEY = "k26_google_oauth"
/** A started sign-in older than this is ignored, so a stale tab can't complete someone else's flow. */
const MAX_AGE_MS = 10 * 60 * 1000

export const GOOGLE_CALLBACK_PATH = "/auth/google/callback"

interface PendingGoogleSignIn {
  state: string
  next: string
  createdAt: number
}

function randomState(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/"
}

/**
 * The site is reachable on both www.<domain> and <domain>; Google only needs to know one. Always
 * return to the bare domain: if it redirects to www, the browser carries the #fragment across the
 * redirect, so the reply still lands on the origin (and sessionStorage) where sign-in started.
 */
export function callbackOrigin(origin: string): string {
  return origin.replace(/^(https?:\/\/)www\./i, "$1")
}

export function buildGoogleAuthUrl(clientId: string, origin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackOrigin(origin) + GOOGLE_CALLBACK_PATH,
    response_type: "token",
    scope: "openid email profile",
    state,
    include_granted_scopes: "true",
    prompt: "select_account",
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

/** Leaves the page for Google's sign-in screen. `next` is where to land after signing in. */
export function startGoogleRedirect(clientId: string, next: string): void {
  const state = randomState()
  const pending: PendingGoogleSignIn = { state, next: safeNext(next), createdAt: Date.now() }
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
  window.location.assign(buildGoogleAuthUrl(clientId, window.location.origin, state))
}

export type GoogleRedirectResult =
  | { ok: true; accessToken: string; next: string }
  | { ok: false; reason: "cancelled" | "invalid" | "failed"; next: string }

/**
 * Reads Google's reply from the callback URL fragment and checks it belongs to the sign-in this tab
 * started. The pending entry is consumed, so a reload or replayed URL cannot be used twice.
 */
export function consumeGoogleRedirect(hash: string): GoogleRedirectResult {
  let pending: PendingGoogleSignIn | null = null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    pending = raw ? (JSON.parse(raw) as PendingGoogleSignIn) : null
  } catch {
    pending = null
  }
  window.sessionStorage.removeItem(STORAGE_KEY)

  const next = safeNext(pending?.next)
  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash)
  const error = params.get("error")
  if (error) {
    return { ok: false, reason: error === "access_denied" ? "cancelled" : "failed", next }
  }

  const accessToken = params.get("access_token")
  const state = params.get("state")
  if (
    !accessToken ||
    !pending ||
    !state ||
    state !== pending.state ||
    Date.now() - pending.createdAt > MAX_AGE_MS
  ) {
    return { ok: false, reason: "invalid", next }
  }
  return { ok: true, accessToken, next }
}
