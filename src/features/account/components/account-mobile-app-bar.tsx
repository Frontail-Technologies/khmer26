"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { ArrowLeft, Plus } from "@phosphor-icons/react"
import type { GeneratedMessageKey } from "@/i18n/message-types"

interface BarAction {
  href: string
  labelKey: GeneratedMessageKey
}

const TITLES: Array<{ prefix: string; key: GeneratedMessageKey; action?: BarAction }> = [
  { prefix: "/account/listings", key: "myListings", action: { href: "/post-ad", labelKey: "postNewAd" } },
  { prefix: "/account/favorites", key: "favorites" },
  { prefix: "/account/saved-searches", key: "savedSearches", action: { href: "/search", labelKey: "newSearch" } },
  { prefix: "/account/notifications", key: "notifications" },
  { prefix: "/account/profile", key: "profile" },
  { prefix: "/account/settings", key: "settings" },
  { prefix: "/account/subscription", key: "subscription" },
  { prefix: "/account/payments", key: "payments" },
]

/**
 * Native-style top bar for account sub-pages on phones: back to the Account hub + page title.
 * Replaces the global header there, so the page gets the full screen. Hidden on the hub itself.
 */
export function AccountMobileAppBar() {
  const tGenerated = useTranslations("generated")
  const pathname = usePathname()
  const match = TITLES.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`))
  if (!match) return null

  return (
    <div
      className="sticky top-0 z-40 -mx-3 mb-3 flex h-14 items-center gap-1 border-b border-border/60 bg-background/85 px-1 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl backdrop-saturate-150 sm:-mx-4 lg:hidden"
      style={{ viewTransitionName: "account-app-bar" }}
    >
      <Link
        href="/account"
        transitionTypes={["nav-back"]}
        aria-label={tGenerated("back")}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors active:bg-muted"
      >
        <ArrowLeft size={22} weight="bold" />
      </Link>
      <h1 className="min-w-0 flex-1 truncate text-[17px] font-bold text-foreground">{tGenerated(match.key)}</h1>
      {match.action && (
        <Link
          href={match.action.href}
          aria-label={tGenerated(match.action.labelKey)}
          className="pressable mr-2 inline-flex h-9 items-center gap-1 rounded-full bg-accent pl-2.5 pr-3.5 text-xs font-bold text-accent-foreground shadow-sm shadow-accent/30"
        >
          <Plus size={16} weight="bold" />
          {tGenerated(match.action.labelKey)}
        </Link>
      )}
    </div>
  )
}
