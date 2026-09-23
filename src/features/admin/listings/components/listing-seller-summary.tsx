import Link from "next/link"
import {
  ArrowSquareOut,
  CalendarBlank,
  EnvelopeSimple,
  ListBullets,
  Phone,
  SealCheck,
  Star,
  User,
} from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AdminListingSeller } from "../types"

interface ListingSellerSummaryProps {
  seller: AdminListingSeller
}

export function ListingSellerSummary({ seller }: ListingSellerSummaryProps) {
  return (
    <Card className="rounded-xl border-0 bg-card p-0 shadow-2xs overflow-hidden space-y-0">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
          <User size={18} className="text-primary" />
          <span>Seller Profile</span>
        </CardTitle>
        {seller.slug && (
          <Link
            href={`/seller/${seller.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>View Public Profile</span>
            <ArrowSquareOut size={13} />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          <Avatar className="size-13 rounded-full border border-border/70 shrink-0">
            <AvatarImage src={seller.avatar} alt={seller.name} />
            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
              {seller.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-foreground">{seller.name}</h3>
              <Badge variant="secondary" className="text-[10px] font-semibold uppercase px-2 h-5">
                {seller.sellerType}
              </Badge>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <SealCheck size={13} weight="fill" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <CalendarBlank size={14} className="text-muted-foreground/70 shrink-0" />
                <span>Member since {seller.joinedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <ListBullets size={14} className="text-muted-foreground/70 shrink-0" />
                <span>{seller.activeListings} active listings</span>
              </div>
              {seller.rating && (
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Star size={13} weight="fill" />
                  <span>{seller.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60 text-xs">
          {seller.phone && (
            <div className="space-y-1 p-2.5 rounded-lg bg-muted/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Phone size={12} />
                <span>Contact Phone</span>
              </span>
              <p className="font-semibold text-foreground font-mono">{seller.phone}</p>
            </div>
          )}

          {seller.email && (
            <div className="space-y-1 p-2.5 rounded-lg bg-muted/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <EnvelopeSimple size={12} />
                <span>Email Address</span>
              </span>
              <p className="font-semibold text-foreground truncate">{seller.email}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
