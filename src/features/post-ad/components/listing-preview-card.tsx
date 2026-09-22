"use client"

import Image from "next/image"
import { Eye, MapPin, Tag, Image as ImageIcon, ShieldCheck } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ListingDraft } from "../types"

interface ListingPreviewCardProps {
  draft: ListingDraft
}

export function ListingPreviewCard({ draft }: ListingPreviewCardProps) {
  const coverPhoto = draft.photos.find((p) => p.isCover) || draft.photos[0]
  const formattedPrice =
    draft.price !== ""
      ? `$${Number(draft.price).toLocaleString()}`
      : "$0"

  const attributeEntries = Object.entries(draft.attributes).filter(
    ([, val]) => Boolean(val)
  ).slice(0, 3)

  return (
    <Card className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="flex items-center gap-1.5 p-3 border-b border-border/60 bg-muted/30">
        <Eye size={16} className="text-primary shrink-0" />
        <span className="text-xs font-bold text-foreground">
          Live Card Preview
        </span>
      </div>

      <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
        {coverPhoto ? (
          <Image
            src={coverPhoto.previewUrl}
            alt={draft.title || "Listing preview"}
            fill
            sizes="350px"
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 p-4 text-center">
            <ImageIcon size={32} className="mb-1" />
            <span className="text-[11px] font-medium">Add photos to preview</span>
          </div>
        )}

        {draft.categoryPath.length > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              className="text-[10px] font-semibold bg-background/80 backdrop-blur-md text-foreground"
            >
              {draft.categoryPath[draft.categoryPath.length - 1]}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3.5 space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-black text-primary tracking-tight">
            {formattedPrice}
          </span>
          {draft.negotiable && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Negotiable
            </span>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug">
          {draft.title || "Untitled Listing"}
        </h3>

        {attributeEntries.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {attributeEntries.map(([key, val]) => (
              <span
                key={key}
                className="text-[10px] bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded font-medium truncate max-w-30"
              >
                {val}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 truncate max-w-37.5">
            <MapPin size={13} className="shrink-0 text-primary" />
            <span className="truncate">
              {draft.location.label || "Select Location"}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Tag size={13} className="shrink-0" />
            <span>{draft.condition || "Condition"}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center font-bold text-[9px] text-primary">
              You
            </div>
            <span className="font-semibold text-foreground">Your Store</span>
            <ShieldCheck size={14} weight="fill" className="text-primary shrink-0" />
          </div>

          <span className="text-[10px] text-muted-foreground">Just now</span>
        </div>
      </CardContent>
    </Card>
  )
}
