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
} from "@phosphor-icons/react"
import { cn } from "cn"

const NAV_ITEMS = [
  {
    label: "Listings",
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

export function AccountMobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden w-full overflow-x-auto no-scrollbar border-b border-border/70 bg-card/80 backdrop-blur-md -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 mb-4 sticky top-14 z-20">
      <div className="flex items-center gap-1.5 min-w-max">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href !== "/account/listings" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                size={15}
                weight={isActive ? "fill" : "regular"}
                className="shrink-0"
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
