import type { Metadata } from "next"
import { ReviewWorkspace } from "@/features/admin/reviews/components/review-workspace"
import { DEMO_ADMIN_REVIEWS } from "@/features/admin/reviews/data/demo-admin-reviews"

export const metadata: Metadata = {
  title: "Reviews",
  description: "Manage marketplace reviews and reported feedback.",
}

export default function AdminReviewsPage() {
  return <ReviewWorkspace initialReviews={DEMO_ADMIN_REVIEWS} />
}
