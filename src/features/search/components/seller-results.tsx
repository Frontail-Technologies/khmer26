"use client"

import { SearchTabs } from "./search-tabs"

/** Keyword search overview: only the tabs; users and companies load on their own pages. */
export function SellerResults({ q }: { q: string }) {
  return (
    <div className="mb-4">
      <SearchTabs q={q} />
    </div>
  )
}
