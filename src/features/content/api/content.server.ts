import { getApiBaseUrl } from "@/lib/api/base-url"
import type { ContentPage, ContentPageSlug } from "../types"

const API_BASE_URL = getApiBaseUrl()

export async function getContentPage(slug: ContentPageSlug): Promise<ContentPage | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/content/pages/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    })
    if (!response.ok) return null
    const body = (await response.json()) as { data?: { page?: ContentPage } }
    return body.data?.page ?? null
  } catch {
    return null
  }
}
