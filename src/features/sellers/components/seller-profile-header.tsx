import Image from "next/image"
import {
  ShieldCheck,
  MapPin,
  CalendarBlank,
} from "@phosphor-icons/react/dist/ssr"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SellerActions } from "./seller-actions"
import type { SellerProfileDetail } from "../types"

interface SellerProfileHeaderProps {
  seller: SellerProfileDetail
}

export function SellerProfileHeader({ seller }: SellerProfileHeaderProps) {
  const initials = seller.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="relative h-36 sm:h-52 md:h-64 w-full overflow-hidden bg-muted">
        {seller.coverImage ? (
          <Image
            src={seller.coverImage}
            alt={`${seller.name} cover`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-r from-primary/15 via-primary/5 to-muted" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
            <div className="-mt-10 sm:-mt-14 shrink-0">
              <Avatar
                size="lg"
                className="h-20 w-20 sm:h-28 sm:w-28 rounded-2xl border-4 border-card shadow-md bg-card"
              >
                {seller.avatar && (
                  <AvatarImage
                    src={seller.avatar}
                    alt={seller.name}
                    className="object-cover rounded-xl"
                  />
                )}
                <AvatarFallback className="font-black text-xl sm:text-2xl bg-primary/10 text-primary rounded-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="pt-1 sm:pt-2 pb-1 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight leading-tight">
                  {seller.name}
                </h1>
                {seller.verified && (
                  <ShieldCheck
                    size={20}
                    weight="fill"
                    className="text-primary shrink-0"
                    aria-label="Verified Seller"
                  />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  @{seller.username}
                </span>

                <Badge
                  variant="secondary"
                  className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5"
                >
                  {seller.sellerType}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:pb-1">
            <SellerActions seller={seller} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 mt-4 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin size={15} className="text-primary shrink-0" />
            <span>{seller.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <CalendarBlank size={15} className="text-muted-foreground shrink-0" />
            <span>Member since {seller.joinedAt}</span>
          </div>

          {seller.responseRate && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              <span>{seller.responseRate} Response Rate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
