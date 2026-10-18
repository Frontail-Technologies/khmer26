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
  Bell,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const NAV_ITEMS: Array<{ label: string; messageKey: GeneratedMessageKey; href: string; icon: typeof ListBullets }> = [
  {
    label: "Listings",
    messageKey: "listings",
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
    label: "Searches",
    messageKey: "savedSearches",
    href: "/account/saved-searches",
    icon: BookmarkSimple,
  },
  {
    label: "Alerts",
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

export function AccountMobileNav() {
  const tGenerated = useTranslations("generated")
  const pathname = usePathname()

  return (
    <nav aria-label={tGenerated("account")} className="mb-4 grid grid-cols-4 gap-1.5 lg:hidden sm:flex sm:flex-wrap">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== "/account/listings" && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-0 select-none flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-2xs font-semibold leading-tight transition-colors sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3 sm:py-1.5 sm:text-xs",
              isActive
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={18} weight={isActive ? "fill" : "regular"} className="shrink-0" />
            <span className="w-full truncate sm:w-auto">{tGenerated(item.messageKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
