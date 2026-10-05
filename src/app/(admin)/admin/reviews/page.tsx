import type { Metadata } from "next"
import { ReviewWorkspace } from "@/features/admin/reviews/components/review-workspace"

export const metadata: Metadata = {
  title: "Reviews",
  description: "Manage marketplace reviews and reported feedback.",
}

export default function AdminReviewsPage() {
  return <ReviewWorkspace />
}
