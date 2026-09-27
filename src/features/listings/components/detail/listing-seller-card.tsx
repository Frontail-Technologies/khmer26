import Link from "next/link"
import {
  ShieldCheck,
  Clock,
  CalendarBlank,
  Storefront,
  ArrowRight,
  ChatCircleDots,
  Phone,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { ListingSeller } from "@/types"

interface ListingSellerCardProps {
  seller: ListingSeller
  listingId?: string
}

export function ListingSellerCard({ seller, listingId }: ListingSellerCardProps) {
  const initials = seller.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card size="sm">
      <CardContent className="pt-(--card-spacing) space-y-3.5">
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="h-12 w-12 border border-border/70">
            {seller.avatar && (
              <AvatarImage src={seller.avatar} alt={seller.name} />
            )}
            <AvatarFallback className="font-bold text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/seller/${seller.slug}`}
                className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors truncate"
              >
                {seller.name}
              </Link>
              {seller.verified && (
                <ShieldCheck
                  size={16}
                  weight="fill"
                  className="text-primary shrink-0"
                  aria-label="Verified Seller"
                />
              )}
            </div>

            {seller.verified && (
              <span className="text-[11px] font-semibold text-primary block">
                Verified Seller
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          {seller.responseTime && (
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-muted-foreground shrink-0" />
              <span>Replies {seller.responseTime}</span>
            </div>
          )}

          {seller.joinedAt && (
            <div className="flex items-center gap-2">
              <CalendarBlank size={15} className="text-muted-foreground shrink-0" />
              <span>Member since {seller.joinedAt}</span>
            </div>
          )}

          {seller.activeListings !== undefined && (
            <div className="flex items-center gap-2">
              <Storefront size={15} className="text-muted-foreground shrink-0" />
              <span>{seller.activeListings} active listings</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {seller.phone && (
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 text-xs font-semibold rounded-lg gap-1 border-border hover:bg-muted"
              render={
                <a href={`tel:${seller.phone.replace(/\s+/g, "")}`}>
                  <Phone size={14} weight="bold" />
                  <span>Call</span>
                </a>
              }
            />
          )}

          {listingId && (
            <Button
              variant="outline"
              size="sm"
              className="h-8.5 text-xs font-semibold rounded-lg gap-1 border-border hover:bg-muted"
              render={
                <Link href={`/messages?listingId=${listingId}`}>
                  <ChatCircleDots size={14} weight="bold" />
                  <span>Chat</span>
                </Link>
              }
            />
          )}
        </div>

        <div className="pt-0.5">
          <Button
            variant="outline"
            className="w-full h-9 text-xs font-semibold rounded-lg justify-between border-border hover:bg-muted"
            render={
              <Link href={`/seller/${seller.slug}`}>
                <span>View Store Profile</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
