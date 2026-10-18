export type SupportSubject = "general" | "feedback" | "report_issue" | "verification" | "business"
export type SupportStatus = "new" | "in_progress" | "resolved" | "spam"

export interface SupportSubmission {
  id: string
  displayId: string
  name: string
  email: string
  subject: SupportSubject
  message: string
  status: SupportStatus
  adminNote: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}
