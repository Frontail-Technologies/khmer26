"use client"

import Link from "next/link"
import Image from "next/image"
import { Sparkle, Star, Lightning, ArrowSquareOut, User, Storefront, CalendarBlank, CreditCard } from "@phosphor-icons/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { ActivePromotionItem } from "../types"

interface PromotionDetailSheetProps {
  promotion: ActivePromotionItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEndPromotion?: (id: string) => void
}

const TYPE_CONFIG = {
  featured: { label: "Featured Listing", icon: Sparkle, badgeClass: "bg-primary/10 text-primary border-primary/20" },
  top_listing: { label: "Top Listing Boost", icon: Star, badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  urgent: { label: "Urgent Badge", icon: Lightning, badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
}

const STATUS_CONFIG: Record<string, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
}

export function PromotionDetailSheet({
  promotion,
  open,
  onOpenChange,
  onEndPromotion,
}: PromotionDetailSheetProps) {
  if (!promotion) return null

  const typeConf = TYPE_CONFIG[promotion.promotionType] || TYPE_CONFIG.featured
  const statusConf = STATUS_CONFIG[promotion.status] || { label: promotion.status, tone: "neutral" as StatusTone }
  const TypeIcon = typeConf.icon

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[340px] sm:w-[440px] p-4 space-y-4 overflow-y-auto text-xs">
        <SheetHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
              <TypeIcon size={16} weight="fill" className="text-primary" />
              <span>Promotion Details</span>
            </div>
            <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
          </div>
          <span className="font-mono text-[11px] text-muted-foreground block pt-1">
            {promotion.id}
          </span>
        </SheetHeader>

        <div className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-3">
            {promotion.listingImage && (
              <div className="relative size-12 rounded-lg overflow-hidden shrink-0 border border-border/60">
                <Image
                  src={promotion.listingImage}
                  alt={promotion.listingTitle}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Marketplace Listing</span>
              <h4 className="font-bold text-xs text-foreground truncate">{promotion.listingTitle}</h4>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono text-[10px]">{promotion.listingId}</span>
                <span>•</span>
                <span className="font-semibold text-foreground">${promotion.listingPrice.toLocaleString()} {promotion.currency}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border/40">
            <Button
              variant="outline"
              size="xs"
              className="w-full text-xs"
              render={
                <Link href={`/admin/listings/${promotion.listingId}`}>
                  <Storefront size={12} className="mr-1" />
                  View Marketplace Listing
                </Link>
              }
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkle size={13} />
              Promotion Specification
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Promotion Type</span>
                <Badge variant="outline" className={`text-[10px] font-semibold ${typeConf.badgeClass}`}>
                  {typeConf.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{promotion.durationDays} Days</span>
              </div>
              {promotion.amountPaid !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-foreground">${promotion.amountPaid.toFixed(2)} USD</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarBlank size={13} />
              Validity Period
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Started Date</span>
                <span className="font-medium text-foreground">{promotion.startedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expires Date</span>
                <span className="font-medium text-foreground">{promotion.expiresAt}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} />
              Seller
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-foreground block">{promotion.sellerName}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{promotion.sellerId}</span>
              </div>
              <Button
                variant="outline"
                size="xs"
                className="text-xs"
                render={
                  <Link href={`/admin/users/${promotion.sellerId}`}>
                    <ArrowSquareOut size={12} className="mr-1" />
                    Account
                  </Link>
                }
              />
            </div>
          </div>

          {promotion.paymentReference && (
            <div className="p-3 rounded-lg bg-background border border-border/70 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={13} />
                Payment Reference
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-foreground">{promotion.paymentReference}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-xs text-primary"
                  render={
                    <Link href={`/admin/payments?search=${promotion.paymentReference}`}>
                      View Payment
                    </Link>
                  }
                />
              </div>
            </div>
          )}

          {promotion.status === "active" && onEndPromotion && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEndPromotion(promotion.id)
                  onOpenChange(false)
                }}
                className="w-full text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
              >
                End Promotion
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
