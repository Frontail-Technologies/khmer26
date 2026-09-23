"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ListBullets,
  Heart,
  User,
  Gear,
  Crown,
  CreditCard,
  ArrowSquareOut,
  SealCheck,
} from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { DEMO_ACCOUNT_PROFILE } from "../data/demo-account-data"

const NAV_ITEMS = [
  {
    label: "My Listings",
    href: "/account/listings",
    icon: ListBullets,
  },
  {
    label: "Favorites",
    href: "/account/favorites",
    icon: Heart,
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: Gear,
  },
  {
    label: "Subscription",
    href: "/account/subscription",
    icon: Crown,
  },
  {
    label: "Payments",
    href: "/account/payments",
    icon: CreditCard,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full space-y-4">
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-full border border-border">
              <AvatarImage
                src={DEMO_ACCOUNT_PROFILE.avatarUrl}
                alt={DEMO_ACCOUNT_PROFILE.fullName}
              />
              <AvatarFallback className="font-bold text-sm bg-primary/10 text-primary">
                {DEMO_ACCOUNT_PROFILE.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-foreground truncate block">
                  {DEMO_ACCOUNT_PROFILE.fullName}
                </span>
                {DEMO_ACCOUNT_PROFILE.emailVerified && (
                  <SealCheck
                    size={16}
                    weight="fill"
                    className="text-primary shrink-0"
                    aria-label="Verified"
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate block">
                @{DEMO_ACCOUNT_PROFILE.username}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 text-[11px] font-semibold"
            >
              Free Plan
            </Badge>

            <Link
              href="/seller/sokha-auto-tech"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <span>Public Store</span>
              <ArrowSquareOut size={13} />
            </Link>
          </div>
        </CardContent>
      </Card>

      <nav className="space-y-1" aria-label="Account Navigation">
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
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
