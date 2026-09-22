"use client"

import { useState } from "react"
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

interface PreviewStepProps {
  draft: ListingDraft
  onEditStep: (step: PostAdStep) => void
  onReset: () => void
}

export function PreviewStep({ draft, onEditStep, onReset }: PreviewStepProps) {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"publish" | "draft">("publish")

  const coverPhoto = draft.photos.find((p) => p.isCover) || draft.photos[0]
  const formattedPrice =
    draft.price !== ""
      ? `$${Number(draft.price).toLocaleString()} ${draft.currency}`
      : "$0 USD"

  const attributeEntries = Object.entries(draft.attributes).filter(
    ([, val]) => Boolean(val)
  )

  const handlePublish = () => {
    try {
      localStorage.removeItem("khmer26_post_ad_draft")
    } catch {
    }
    setActionType("publish")
    setSuccessDialogOpen(true)
  }

  const handleSaveDraft = () => {
    try {
      localStorage.setItem("khmer26_post_ad_draft", JSON.stringify(draft))
    } catch {
    }
    setActionType("draft")
    setSuccessDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Review & Publish
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Check all details below before publishing your marketplace listing
        </p>
      </div>

      <Card className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
          <div className="relative aspect-4/3 sm:w-48 sm:h-36 rounded-lg overflow-hidden bg-muted shrink-0">
            {coverPhoto ? (
              <Image
                src={coverPhoto.previewUrl}
                alt={draft.title}
                fill
                sizes="200px"
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
                  Negotiable
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
              {draft.title}
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
              Category
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 text-xs sm:text-sm font-semibold text-foreground">
            {draft.categoryPath.join(" > ")}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Specifications & Details
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {attributeEntries.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {attributeEntries.map(([key, val]) => (
                  <div key={key} className="p-2 rounded-lg bg-muted/40 text-xs">
                    <span className="text-muted-foreground block text-[10px] capitalize">
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
              <span className="font-semibold text-muted-foreground block text-[11px] mb-1">
                Description:
              </span>
              <p className="whitespace-pre-line">{draft.description}</p>
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
              <span>Edit</span>
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
                    className="object-cover"
                  />
                  {photo.isCover && (
                    <span className="absolute bottom-1 left-1 rounded bg-primary text-primary-foreground text-[8px] font-bold px-1 py-0.5">
                      Cover
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
              Contact Preferences
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(5)}
              className="h-7 px-2 text-xs font-semibold text-primary gap-1 p-0"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex items-center gap-4 text-xs text-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <ChatCircleDots size={16} className="text-primary" />
              <span>
                {draft.contactMethod === "chat"
                  ? "In-App Chat Only"
                  : draft.contactMethod === "both"
                  ? "Chat & Phone Call"
                  : "Phone Call Only"}
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

      <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
        <Button
          type="button"
          onClick={handlePublish}
          className="w-full sm:flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-xl shadow-sm gap-2"
        >
          <Rocket size={20} weight="bold" />
          <span>Publish Listing</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          className="w-full sm:w-auto h-12 px-6 font-semibold text-xs sm:text-sm rounded-xl border-border gap-1.5"
        >
          <BookmarkSimple size={18} />
          <span>Save as Draft</span>
        </Button>
      </div>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-2">
              <CheckCircle size={32} weight="fill" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              {actionType === "publish"
                ? "Listing Published Successfully!"
                : "Draft Saved Successfully!"}
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              {actionType === "publish"
                ? `Your ad "${draft.title}" is now live and ready for buyer inquiries.`
                : `Your draft "${draft.title}" was safely saved to your account.`}
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
              Post Another Ad
            </Button>

            <Button
              className="w-full sm:flex-1 text-xs font-semibold h-10 bg-primary text-primary-foreground gap-1.5"
              render={
                <Link href="/account/listings">
                  <span>Go to My Listings</span>
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
