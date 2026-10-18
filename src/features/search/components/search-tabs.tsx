"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

/** Users / Companies / Posts: each tab is its own page for the same keyword. */
export function SearchTabs({ q }: { q: string }) {
  const t = useTranslations("ui.searchBar")
  const pathname = usePathname()
  const query = encodeURIComponent(q)
  const tabs = [
    { href: `/search/users?q=${query}`, path: "/search/users", label: t("users") },
    { href: `/search/companies?q=${query}`, path: "/search/companies", label: t("companies") },
    { href: `/search/posts?q=${query}`, path: "/search/posts", label: t("posts") },
  ]

  return (
    <nav aria-label={t("sellers")} className="grid grid-cols-3 gap-2">
      {tabs.map((tab) => {
        const active = pathname === tab.path
        return (
          <Link
            key={tab.path}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
