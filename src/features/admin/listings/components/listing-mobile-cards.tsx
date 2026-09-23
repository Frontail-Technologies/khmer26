"use client"

import Link from "next/link"
import Image from "next/image"
import { CaretRight, Flag, Eye, ArrowsDownUp } from "@phosphor-icons/react"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import type { AdminListing, AdminListingStatus } from "../types"

const STATUS_TONE_MAP: Record<AdminListingStatus, StatusTone> = {
  pending: "warning",
  flagged: "destructive",
  active: "success",
  sold: "neutral",
  expired: "neutral",
  rejected: "destructive",
  removed: "destructive",
  draft: "neutral",
}

const STATUS_LABEL_MAP: Record<AdminListingStatus, string> = {
  pending: "Pending",
  flagged: "Flagged",
  active: "Active",
  sold: "Sold",
  expired: "Expired",
  rejected: "Rejected",
  removed: "Removed",
  draft: "Draft",
}

interface ListingMobileCardsProps {
  data: AdminListing[]
  sortBy?: string
  onSortChange?: (value: string) => void
}

const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "reports", label: "Most Reported" },
  { value: "views", label: "Most Viewed" },
]

export function ListingMobileCards({
  data,
  sortBy = "newest",
  onSortChange,
}: ListingMobileCardsProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center bg-card shadow-2xs">
        <p className="text-xs font-semibold text-foreground">No listings found</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Try changing your search keywords or active filters.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {onSortChange && (
        <div className="flex items-center justify-between gap-2 pb-1">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <ArrowsDownUp size={13} />
            <span>Sort Listings:</span>
          </span>
          <div className="w-44">
            <Select
              value={sortBy}
              items={SORT_OPTIONS}
              onValueChange={(val) => val && onSortChange(val)}
            >
              <SelectTrigger size="sm" className="h-8 text-[11px] bg-card rounded-lg">
                <SelectValue placeholder="Sort Listings">
                  {(val) => getSelectOptionLabel(SORT_OPTIONS, val, "Sort Listings")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="end">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {data.map((listing) => {
          const primaryImage = listing.images[0]?.url
          const formattedPrice =
            listing.currency === "USD"
              ? `$${listing.price.toLocaleString("en-US")}`
              : `${listing.price.toLocaleString("en-US")} KHR`

          return (
            <Link
              key={listing.id}
              href={`/admin/listings/${listing.id}`}
              className="block"
            >
              <Card className="rounded-xl border-0 bg-card p-3.5 shadow-2xs hover:bg-muted/10 transition-all active:scale-[0.99]">
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative size-16 rounded-lg overflow-hidden border border-border/70 bg-muted/40 shrink-0">
                      {primaryImage ? (
                        <Image
                          src={primaryImage}
                          alt={listing.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-[9px] text-muted-foreground font-bold">
                          NO IMG
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-bold text-foreground line-clamp-1 flex-1">
                          {listing.title}
                        </span>
                        <StatusBadge
                          label={STATUS_LABEL_MAP[listing.status]}
                          tone={STATUS_TONE_MAP[listing.status]}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground font-mono">
                          {formattedPrice}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {listing.categoryName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 min-w-0">
                        <Avatar className="size-4.5 rounded-full border border-border shrink-0">
                          <AvatarImage src={listing.seller.avatar} alt={listing.seller.name} />
                          <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">
                            {listing.seller.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-muted-foreground truncate">
                          {listing.seller.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="font-semibold text-foreground">{listing.id}</span>
                      <span>•</span>
                      <span>{listing.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {listing.reports.length > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-destructive">
                          <Flag size={11} weight="fill" />
                          <span>{listing.reports.length}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Eye size={11} />
                        <span>{listing.viewCount}</span>
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-primary font-semibold text-[10px]">
                        <span>Review</span>
                        <CaretRight size={10} weight="bold" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
