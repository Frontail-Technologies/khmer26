import { getApiBaseUrl } from "@/lib/api/base-url"
import type { AuthUser } from "./auth.api"

interface CurrentUserResponse {
  success: boolean
  data?: { user?: AuthUser }
}

/**
 * Resolves the current user during the initial Next.js request. Authentication
 * cookies are forwarded explicitly because the API runs on a separate origin.
 */
export async function getServerCurrentUser(cookieHeader: string): Promise<AuthUser> {
  const response = await fetch(`${getApiBaseUrl().replace(/\/$/, "")}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookieHeader,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Server authentication lookup failed with ${response.status}`)
  }

  const payload = (await response.json()) as CurrentUserResponse
  const user = payload.data?.user
  if (!payload.success || !user) throw new Error("Server authentication response is invalid")
  return user
}
