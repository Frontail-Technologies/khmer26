"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  PencilSimple,
  Rocket,
  BookmarkSimple,
  MapPin,
  Tag,
  ChatCircleDots,
  Phone,
  ArrowSquareOut,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { ListingDraft, PostAdStep } from "../../types"
import { categoryFieldsQueryOptions } from "@/features/categories/api/categories.queries"
import { buildCreateListingInput } from "../../api/post-ad.api"
import { useCreateListing, useUpdateListing } from "../../api/post-ad.mutations"
import type { ListingModerationMatch } from "@/features/content/types"
import { HighlightedModerationText, ModerationKeywordNotice } from "@/features/content/components/moderation-keyword-notice"

interface PreviewStepProps {
  draft: ListingDraft
  listingId?: string
  existingIsDraft: boolean
  onEditStep: (step: PostAdStep) => void
  onReset: () => void
  moderationMatches: ListingModerationMatch[]
}

export function PreviewStep({
  draft,
  listingId,
  existingIsDraft,
  onEditStep,
  onReset,
  moderationMatches,
}: PreviewStepProps) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.postAd")
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"publish" | "draft">("publish")
  const [submitError, setSubmitError] = useState<string | null>(null)
  const createListing = useCreateListing()
  const updateListing = useUpdateListing()
  const isPending = createListing.isPending || updateListing.isPending
  const { data: categoryFields = [] } = useQuery({
    ...categoryFieldsQueryOptions(draft.categoryId),
    enabled: Boolean(draft.categoryId),
  })

  const coverPhoto = draft.photos.find((p) => p.isCover) || draft.photos[0]
  const formattedPrice =
    draft.price !== ""
      ? `$${Number(draft.price).toLocaleString()} ${draft.currency}`
      : "$0 USD"

  const attributeEntries = Object.entries(draft.attributes).filter(
    ([, val]) => Boolean(val)
  )

  const submit = async (isDraft: boolean) => {
    setSubmitError(null)
    setActionType(isDraft ? "draft" : "publish")
    try {
      const input = buildCreateListingInput(draft, categoryFields)
      if (listingId) {
        await updateListing.mutateAsync({
          id: listingId,
          input,
          submit: existingIsDraft && !isDraft,
        })
      } else {
        await createListing.mutateAsync({ input, isDraft })
      }
      localStorage.removeItem("khmer26_post_ad_draft")
      setSuccessDialogOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("saveFailed"))
    }
  }

  const handlePublish = () => submit(false)
  const handleSaveDraft = () => submit(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          <LocalizedText id="reviewPublish" />
        </h2>
      </div>

      <ModerationKeywordNotice matches={moderationMatches} />

      <Card className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
          <div className="relative aspect-4/3 sm:w-48 sm:h-36 rounded-lg overflow-hidden bg-muted shrink-0">
            {coverPhoto ? (
              <Image
                src={coverPhoto.previewUrl}
                alt={draft.title}
                fill
                sizes="200px"
                unoptimized={coverPhoto.previewUrl.startsWith("blob:")}
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-primary">
                {formattedPrice}
              </span>
              {draft.negotiable && (
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  <LocalizedText id="negotiable" />
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
              <HighlightedModerationText text={draft.title} matches={moderationMatches} field="title" />
            </h3>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} className="text-primary" />
                <span>{draft.location.label}</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Tag size={14} />
                <span>{draft.condition.replace(/_/g, " ").toUpperCase()}</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <LocalizedText id="category" />
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span><LocalizedText id="edit" /></span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm font-semibold text-foreground">
            {draft.categoryPath.join(" > ")}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <LocalizedText id="specificationsDetails" />
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span><LocalizedText id="edit" /></span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {attributeEntries.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attributeEntries.map(([key, val]) => (
                  <div key={key} className="p-2 rounded-lg bg-muted/40 text-xs">
                    <span className="text-muted-foreground block text-2xs capitalize">
                      {key}
                    </span>
                    <span className="font-bold text-foreground block truncate">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-border/50 text-xs text-foreground/90 leading-relaxed">
              <span className="font-semibold text-muted-foreground block text-xxs mb-1">
                <LocalizedText id="description_9b6f3f" />
              </span>
              <p className="whitespace-pre-line"><HighlightedModerationText text={draft.description} matches={moderationMatches} field="description" /></p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Photos ({draft.photos.length})
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(3)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span><LocalizedText id="edit" /></span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {draft.photos.map((photo, i) => (
                <div
                  key={photo.id || i}
                  className="relative aspect-4/3 rounded-lg overflow-hidden border border-border bg-muted"
                >
                  <Image
                    src={photo.previewUrl}
                    alt={`Photo ${i + 1}`}
                    fill
                    sizes="100px"
                    unoptimized={photo.previewUrl.startsWith("blob:")}
                    className="object-cover"
                  />
                  {photo.isCover && (
                    <span className="absolute bottom-1 left-1 rounded bg-primary text-primary-foreground text-[8px] font-bold px-1 py-0.5">
                      <LocalizedText id="cover" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <LocalizedText id="contactPreferences" />
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(5)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span><LocalizedText id="edit" /></span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex items-center gap-4 text-xs text-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <ChatCircleDots size={16} className="text-primary" />
              <span>
                {draft.contactMethod === "chat"
                  ? tGenerated("inAppChatOnly")
                  : draft.contactMethod === "both"
                  ? t("contactBothTitle")
                  : t("contactPhoneTitle")}
              </span>
            </div>

            {draft.phoneNumber && (
              <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                <Phone size={14} />
                <span>{draft.phoneNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {submitError && (
        <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs font-medium text-destructive">
          {submitError}
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <Button
          type="button"
          onClick={handlePublish}
          disabled={isPending}
          className="w-full sm:flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-xl shadow-sm gap-2"
        >
          <Rocket size={20} weight="bold" />
          <span>
            {isPending && actionType === "publish"
              ? listingId && !existingIsDraft ? t("submittingChanges") : t("publishing")
              : listingId && !existingIsDraft ? t("submitChanges") : t("publishListing")}
          </span>
        </Button>

        {(!listingId || existingIsDraft) && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="w-full sm:w-auto h-12 px-6 font-semibold text-xs sm:text-sm rounded-xl border-border gap-1.5"
          >
            <BookmarkSimple size={18} />
            <span>{isPending && actionType === "draft" ? tGenerated("saving") : tGenerated("saveAsDraft")}</span>
          </Button>
        )}
      </div>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-2">
              <CheckCircle size={32} weight="fill" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              {actionType === "publish"
                ? listingId && !existingIsDraft
                  ? t("changesSubmitted")
                  : t("listingSubmitted")
                : tGenerated("draftSavedSuccessfully")}
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              {actionType === "publish"
                ? `Your ${listingId ? "listing" : "ad"} "${draft.title}" was submitted for review. You can track its status in My Listings.`
                : `Your draft "${draft.title}" was saved to your account.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessDialogOpen(false)
                onReset()
              }}
              className="w-full sm:flex-1 text-xs font-semibold h-10"
            >
              <LocalizedText id="postAnotherAd" />
            </Button>

            <Button
              className="w-full sm:flex-1 text-xs font-semibold h-10 bg-primary text-primary-foreground gap-1.5"
              render={
                <Link href="/account/listings">
                  <span><LocalizedText id="goToMyListings" /></span>
                  <ArrowSquareOut size={16} />
                </Link>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
