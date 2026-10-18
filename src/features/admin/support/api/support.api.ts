import { apiClient } from "@/lib/api/client"
import type { SupportStatus, SupportSubject, SupportSubmission } from "../types"

export interface SupportQuery {
  [key: string]: string | number | undefined
  page?: number
  limit?: number
  status?: SupportStatus
  subject?: SupportSubject
  q?: string
}

export async function getSupportSubmissions(params: SupportQuery) {
  const response = await apiClient.get<SupportSubmission[]>("/admin/support-submissions", { params })
  return {
    items: response.data,
    meta: response.meta ?? { page: 1, limit: 20, total: response.data.length, totalPages: 1 },
  }
}

export async function updateSupportSubmission(
  id: string,
  input: { status?: SupportStatus; adminNote?: string | null }
) {
  const response = await apiClient.patch<{ submission: SupportSubmission }>(
    `/admin/support-submissions/${id}`,
    input
  )
  return response.data.submission
}
