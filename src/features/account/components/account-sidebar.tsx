"use client"

import { useTranslations } from "next-intl"
import type { GeneratedMessageKey } from "@/i18n/message-types"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ListBullets,
  Heart,
  BookmarkSimple,
  User,
  Gear,
  Crown,
  CreditCard,
  ArrowSquareOut,
  SealCheck,
  Bell,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { useAccountProfile } from "../profile/api/profile.queries"
import { useSubscriptionUsage } from "../subscription/api/subscription.queries"

const NAV_ITEMS: Array<{ label: string; messageKey: GeneratedMessageKey; href: string; icon: typeof ListBullets }> = [
  {
    label: "My Listings",
    messageKey: "myListings",
    href: "/account/listings",
    icon: ListBullets,
  },
  {
    label: "Favorites",
    messageKey: "favorites",
    href: "/account/favorites",
    icon: Heart,
  },
  {
    label: "Saved Searches",
    messageKey: "savedSearches",
    href: "/account/saved-searches",
    icon: BookmarkSimple,
  },
  {
    label: "Notifications",
    messageKey: "notifications",
    href: "/account/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    messageKey: "profile",
    href: "/account/profile",
    icon: User,
  },
  {
    label: "Settings",
    messageKey: "settings",
    href: "/account/settings",
    icon: Gear,
  },
  {
    label: "Subscription",
    messageKey: "subscription",
    href: "/account/subscription",
    icon: Crown,
  },
  {
    label: "Payments",
    messageKey: "payments",
    href: "/account/payments",
    icon: CreditCard,
  },
]

export function AccountSidebar() {
  const tGenerated = useTranslations("generated")
  const pathname = usePathname()
  const { data: account } = useAccountProfile()
  const { data: usage } = useSubscriptionUsage()
  const planName = usage?.plan.name ?? "Free Plan"
  const profile = account?.sellerProfile
  const fallbackName = account?.user.email?.split("@")[0] ?? "My account"
  const displayName = profile?.fullName || profile?.shopName || fallbackName
  const username = profile?.username || fallbackName
  const avatarUrl = getMediaUrl(profile?.avatarR2Key)

  return (
    <aside className="w-full space-y-4">
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-full border border-border">
              <AvatarImage
                src={avatarUrl ?? undefined}
                alt={displayName}
              />
              <AvatarFallback className="font-bold text-sm bg-primary/10 text-primary">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-foreground truncate block">
                  {displayName}
                </span>
                {account?.user.emailVerifiedAt && (
                  <SealCheck
                    size={16}
                    weight="fill"
                    className="text-primary shrink-0"
                    aria-label={tGenerated("verified")}
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                @{username}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-xxs font-semibold"
            >
              {planName}
            </Badge>

            <Link
              href={profile ? `/seller/${profile.id}` : "/account/profile"}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <span>{profile ? tGenerated("publicStore") : tGenerated("createProfile")}</span>
              <ArrowSquareOut size={13} />
            </Link>
          </div>
        </CardContent>
      </Card>

      <nav className="space-y-1" aria-label={tGenerated("accountNavigation")}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/account/listings" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all select-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <Icon
                size={18}
                weight={isActive ? "fill" : "regular"}
                className={cn("shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")}
              />
              <span className="truncate">{tGenerated(item.messageKey)}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
