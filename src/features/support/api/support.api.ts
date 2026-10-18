import { apiClient } from "@/lib/api/client"

export type SupportSubject =
  | "general"
  | "feedback"
  | "report_issue"
  | "verification"
  | "business"

export interface CreateSupportSubmissionInput {
  name: string
  email: string
  subject: SupportSubject
  message: string
  website?: string
}

export async function createSupportSubmission(input: CreateSupportSubmissionInput) {
  const response = await apiClient.post<{
    submission: { displayId: string; createdAt: string }
  }>("/support/contact", input)
  return response.data.submission
}
