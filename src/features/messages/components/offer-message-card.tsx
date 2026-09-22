"use client"

import { Tag, CheckCircle, XCircle, ArrowCounterClockwise } from "@phosphor-icons/react"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import type { ConversationOffer, ConversationRole } from "../types"

interface OfferMessageCardProps {
  offer: ConversationOffer
  role: ConversationRole
  isCurrentUserSender: boolean
  onAcceptOffer?: (offerId: string) => void
  onDeclineOffer?: (offerId: string) => void
  onWithdrawOffer?: (offerId: string) => void
}

function getOfferStatusConfig(status: ConversationOffer["status"]): { label: string; tone: StatusTone } {
  switch (status) {
    case "pending":
      return { label: "Pending", tone: "warning" }
    case "accepted":
      return { label: "Offer Accepted", tone: "success" }
    case "declined":
      return { label: "Offer Declined", tone: "destructive" }
    case "countered":
      return { label: "Countered", tone: "accent" }
    case "withdrawn":
      return { label: "Withdrawn", tone: "neutral" }
    case "expired":
      return { label: "Expired", tone: "neutral" }
    default:
      return { label: status, tone: "neutral" }
  }
}

export function OfferMessageCard({
  offer,
  role,
  isCurrentUserSender,
  onAcceptOffer,
  onDeclineOffer,
  onWithdrawOffer,
}: OfferMessageCardProps) {
  const isSeller = role === "seller"
  const { label, tone } = getOfferStatusConfig(offer.status)

  return (
    <div className="w-full max-w-sm rounded-2xl border border-primary/30 bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-primary">
          <Tag size={18} weight="fill" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Price Offer
          </span>
        </div>
        <StatusBadge label={label} tone={tone} size="sm" />
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-primary">
            ${offer.amount.toLocaleString()} {offer.currency}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ${offer.askingPrice.toLocaleString()}
          </span>
        </div>

        {offer.message && (
          <p className="text-xs text-foreground/90 bg-muted/50 p-2.5 rounded-xl italic">
            &quot;{offer.message}&quot;
          </p>
        )}
      </div>

      {offer.status === "pending" && (
        <div className="pt-2 border-t border-border/60">
          {isSeller && !isCurrentUserSender ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => onAcceptOffer?.(offer.id)}
                className="flex-1 h-8 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-1"
              >
                <CheckCircle size={14} weight="bold" />
                <span>Accept</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDeclineOffer?.(offer.id)}
                className="flex-1 h-8 text-xs font-semibold text-destructive hover:bg-destructive/10 gap-1"
              >
                <XCircle size={14} />
                <span>Decline</span>
              </Button>
            </div>
          ) : isCurrentUserSender ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onWithdrawOffer?.(offer.id)}
              className="w-full h-8 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
            >
              <ArrowCounterClockwise size={14} />
              <span>Withdraw Offer</span>
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
