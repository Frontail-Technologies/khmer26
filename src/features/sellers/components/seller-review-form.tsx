"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { Info, Star } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ApiError } from "@/lib/api/client"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { useReviewEligibility, useSubmitReview } from "../api/sellers.queries"

const ERROR_KEYS = {
  DUPLICATE_REVIEW: "reviewDuplicate",
  SELF_REVIEW_PROHIBITED: "reviewSelf",
  REVIEW_NOT_ELIGIBLE: "reviewNotEligible",
} as const

type ReviewErrorTranslator = ReturnType<typeof useTranslations<"ui.sellers">>

/** The backend puts the specific rule in `details.code`; the top-level code is only the HTTP class. */
function specificCode(err: ApiError): string | undefined {
  const details = err.details
  if (details && typeof details === "object" && "code" in details) {
    const code = (details as { code: unknown }).code
    if (typeof code === "string") return code
  }
  return undefined
}

export function reviewErrorMessage(err: unknown, t: ReviewErrorTranslator): string {
  if (err instanceof ApiError) {
    const code = specificCode(err)
    const key = code ? ERROR_KEYS[code as keyof typeof ERROR_KEYS] : undefined
    return key ? t(key) : t("reviewFailed")
  }
  return t("reviewFailed")
}

interface SellerReviewFormProps {
  sellerId: string
  isOwnProfile: boolean
}

export function SellerReviewForm({ sellerId, isOwnProfile }: SellerReviewFormProps) {
  const tGenerated = useTranslations("generated")
  const tSellers = useTranslations("ui.sellers")
  const requireAuth = useRequireAuth()
  const submit = useSubmitReview(sellerId)
  const eligibility = useReviewEligibility(sellerId, !isOwnProfile)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  if (isOwnProfile) return null

  if (eligibility.isPending) {
    return <div className="h-20 animate-pulse rounded-xl border border-border/80 bg-muted/30" />
  }

  if (!eligibility.data?.eligible || !eligibility.data.deal) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground">
        <Info size={17} className="mt-0.5 shrink-0 text-primary" />
        <div className="space-y-2">
          <p><LocalizedText id="reviewVerifiedDealsOnly" /></p>
          {eligibility.data?.reason === "AUTH_REQUIRED" && (
            <Button type="button" variant="outline" size="sm" onClick={() => requireAuth(() => undefined)}>
              <LocalizedText id="signInToReview" />
            </Button>
          )}
        </div>
      </div>
    )
  }
  const deal = eligibility.data.deal

  if (submit.isSuccess) {
    return (
      <div role="status" className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm font-medium text-foreground">
        <LocalizedText id="thanksYourReviewHasBeenPosted" />
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || submit.isPending) return
    requireAuth(() =>
      submit.mutate({
        listingId: deal.listingId,
        offerId: deal.offerId,
        rating,
        ...(comment.trim() ? { comment: comment.trim() } : {}),
      })
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={tGenerated("writeAReview")}
      className="space-y-3 rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs"
    >
      <h3 className="text-sm font-bold text-foreground"><LocalizedText id="writeAReview" /></h3>
      <p className="text-xs text-muted-foreground">
        {tGenerated("reviewingPurchase", { title: deal.listingTitle })}
      </p>

      <div role="radiogroup" aria-label={tGenerated("rating")} className="flex items-center gap-1 text-accent">
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
        placeholder={tGenerated("shareYourExperienceWithThisSellerOptional")}
        aria-label={tGenerated("reviewComment")}
        className="w-full resize-none rounded-lg border border-border bg-background p-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {submit.isError && (
        <p role="alert" className="text-xs font-medium text-destructive">
          {reviewErrorMessage(submit.error, tSellers)}
        </p>
      )}

      <Button type="submit" disabled={rating < 1 || submit.isPending} className="h-9 px-5 text-xs font-semibold">
        {submit.isPending ? tGenerated("posting") : tGenerated("postReview")}
      </Button>
    </form>
  )
}
