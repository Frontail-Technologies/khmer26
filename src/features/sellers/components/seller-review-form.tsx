"use client"

import { useState } from "react"
import { Star } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/client"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { useSubmitReview } from "../api/sellers.queries"

const ERROR_COPY: Record<string, string> = {
  DUPLICATE_REVIEW: "You have already reviewed this seller.",
  SELF_REVIEW_PROHIBITED: "You can't review your own shop.",
}

/** The backend puts the specific rule in `details.code`; the top-level code is only the HTTP class. */
function specificCode(err: ApiError): string | undefined {
  const details = err.details
  if (details && typeof details === "object" && "code" in details) {
    const code = (details as { code: unknown }).code
    if (typeof code === "string") return code
  }
  return undefined
}

export function reviewErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const code = specificCode(err)
    return (code && ERROR_COPY[code]) || err.message || "Couldn't submit your review. Please try again."
  }
  return "Couldn't submit your review. Please try again."
}

interface SellerReviewFormProps {
  sellerId: string
  isOwnProfile: boolean
}

export function SellerReviewForm({ sellerId, isOwnProfile }: SellerReviewFormProps) {
  const requireAuth = useRequireAuth()
  const submit = useSubmitReview(sellerId)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  if (isOwnProfile) return null

  if (submit.isSuccess) {
    return (
      <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm font-medium text-foreground">
        Thanks — your review has been posted.
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || submit.isPending) return
    requireAuth(() =>
      submit.mutate({ rating, ...(comment.trim() ? { comment: comment.trim() } : {}) })
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Write a review"
      className="space-y-3 rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs"
    >
      <h3 className="text-sm font-bold text-foreground">Write a review</h3>

      <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1 text-accent">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
            onClick={() => setRating(value)}
            className="cursor-pointer rounded p-0.5 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Star size={26} weight={value <= rating ? "fill" : "regular"} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Share your experience with this seller (optional)"
        aria-label="Review comment"
        className="w-full resize-none rounded-lg border border-border bg-background p-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {submit.isError && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {reviewErrorMessage(submit.error)}
        </p>
      )}

      <Button type="submit" disabled={rating < 1 || submit.isPending} className="h-9 px-5 text-xs font-semibold">
        {submit.isPending ? "Posting…" : "Post review"}
      </Button>
    </form>
  )
}
