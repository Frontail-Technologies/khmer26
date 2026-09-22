import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Tag,
  ArrowSquareOut,
  ShieldCheck,
  SealCheck,
  Phone,
  Clock,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ConversationListing, ConversationParticipant, ConversationRole } from "../types"

interface ListingContextPanelProps {
  listing: ConversationListing
  participant: ConversationParticipant
  role: ConversationRole
  onOpenMakeOffer?: () => void
}

export function ListingContextPanel({
  listing,
  participant,
  role,
  onOpenMakeOffer,
}: ListingContextPanelProps) {
  return (
    <aside className="w-72 xl:w-80 h-full bg-card border-l border-border/70 overflow-y-auto p-4 space-y-4 no-scrollbar shrink-0">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Item in Conversation
        </span>
      </div>

      <Card className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs">
        <div className="relative aspect-4/3 w-full bg-muted overflow-hidden">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="300px"
            className="object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant="outline"
              className="bg-background/90 backdrop-blur-xs text-foreground font-bold text-[10px] uppercase tracking-wider px-2 py-0.5"
            >
              {listing.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-3.5 space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-black text-primary">
              ${listing.price.toLocaleString()} {listing.currency}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Negotiable
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={13} className="text-primary shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="pt-2 space-y-2 border-t border-border/60">
            <Button
              render={
                <Link href={`/listing/${listing.slug}`}>
                  <span>View Full Listing</span>
                  <ArrowSquareOut size={15} />
                </Link>
              }
              className="w-full h-9 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-1.5 shadow-2xs"
            />

            {role === "buyer" && listing.status === "active" && onOpenMakeOffer && (
              <Button
                type="button"
                variant="outline"
                onClick={onOpenMakeOffer}
                className="w-full h-9 text-xs font-bold rounded-xl gap-1.5 text-accent border-accent/30 hover:bg-accent/10"
              >
                <Tag size={15} weight="bold" />
                <span>Make a Price Offer</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">
            {participant.role === "seller" ? "Seller Details" : "Buyer Details"}
          </span>
          {participant.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
              <SealCheck size={14} weight="fill" />
              <span>Verified</span>
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-muted-foreground text-[11px]">
          {participant.responseTime && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="shrink-0" />
              <span>{participant.responseTime}</span>
            </div>
          )}

          {participant.joinedAt && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="shrink-0" />
              <span>Member since {participant.joinedAt}</span>
            </div>
          )}

          {participant.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="shrink-0" />
              <span>{participant.phone}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
