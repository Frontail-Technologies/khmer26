"use client"

import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { LinkTabs } from "@/components/shared/link-tabs"

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
    <LinkTabs
      label={t("sellers")}
      className="-mx-3 px-1 sm:mx-0 sm:px-0"
      items={tabs.map((tab) => ({ href: tab.href, label: tab.label, active: pathname === tab.path }))}
    />
  )
}
