"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChatCircleDots,
  Phone,
  CurrencyDollar,
  ShareNetwork,
  Flag,
  MapPin,
  Clock,
  Eye,
  Check,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/features/listings/components/favorite-button"
import { ListingReportDialog } from "./listing-report-dialog"
import { ListingMakeOfferDialog } from "./listing-make-offer-dialog"
import type { ListingDetail } from "@/types"

interface ListingPrimaryPanelProps {
  listing: ListingDetail
}

import { formatPriceWithCurrency } from "@/lib/formatters/currency"
import { formatRelativeTime } from "@/lib/formatters/date"

export function ListingPrimaryPanel({ listing }: ListingPrimaryPanelProps) {
  const router = useRouter()
  const [showPhone, setShowPhone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)

  const formattedPrice = formatPriceWithCurrency(listing.price, listing.currency)

  const sellerPhone = listing.seller?.phone || "+855 12 889 977"
  const timeAgo = formatRelativeTime(listing.createdAt)

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Card size="sm">
        <CardContent className="pt-(--card-spacing) space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                  {formattedPrice}
                </span>
                {listing.negotiable && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    Negotiable
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <FavoriteButton
                  listingId={listing.id}
                  initialFavorited={listing.isFavorited}
                  className="h-9 w-9 bg-muted/60 hover:bg-muted"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleShare}
                  aria-label="Share listing"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <Check size={18} className="text-primary" />
                  ) : (
                    <ShareNetwork size={18} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setReportOpen(true)}
                  aria-label="Report listing"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                >
                  <Flag size={18} />
                </Button>
              </div>
            </div>

            <h1 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {listing.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-muted-foreground pt-1 border-t border-border/60">
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin size={15} className="text-primary shrink-0" />
              <span>{listing.location.label || listing.location.province}</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock size={15} className="shrink-0" />
              <span>{timeAgo}</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <Eye size={15} className="shrink-0" />
              <span>{listing.viewCount} views</span>
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm gap-2"
              onClick={() => {
                router.push(`/messages?listingId=${listing.id}`)
              }}
            >
              <ChatCircleDots size={20} weight="fill" />
              <span>Chat with Seller</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-10 text-xs sm:text-sm font-semibold rounded-lg gap-1.5 border-border hover:bg-muted"
                onClick={() => setShowPhone((prev) => !prev)}
              >
                <Phone size={16} weight="bold" />
                <span>{showPhone ? sellerPhone : "Show Phone"}</span>
              </Button>

              <Button
                variant="outline"
                className="h-10 text-xs sm:text-sm font-semibold rounded-lg gap-1.5 border-border hover:bg-muted"
                onClick={() => setOfferOpen(true)}
              >
                <CurrencyDollar size={16} weight="bold" />
                <span>Make Offer</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ListingReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        listingTitle={listing.title}
      />

      <ListingMakeOfferDialog
        open={offerOpen}
        onOpenChange={setOfferOpen}
        listingTitle={listing.title}
        askingPrice={listing.price}
        currency={listing.currency}
      />
    </>
  )
}
