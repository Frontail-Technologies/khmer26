import type { Metadata } from "next"
import { ReviewWorkspace } from "@/features/admin/reviews/components/review-workspace"
import { DEMO_REVIEW_STATS } from "@/features/admin/reviews/data/demo-review-stats"
import { DEMO_ADMIN_REVIEWS } from "@/features/admin/reviews/data/demo-admin-reviews"

export const metadata: Metadata = {
  title: "Seller Reviews & Ratings",
  description: "Monitor seller reviews, customer ratings and feedback.",
}

export default function AdminReviewsPage() {
  return (
    <ReviewWorkspace
      stats={DEMO_REVIEW_STATS}
      initialReviews={DEMO_ADMIN_REVIEWS}
    />
  )
}
