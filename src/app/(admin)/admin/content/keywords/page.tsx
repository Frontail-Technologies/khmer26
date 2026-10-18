import type { Metadata } from "next"
import { ModerationKeywordsWorkspace } from "@/features/admin/content/components/moderation-keywords-workspace"

export const metadata: Metadata = { title: "Review Keywords" }

export default function AdminReviewKeywordsPage() {
  return <ModerationKeywordsWorkspace />
}
