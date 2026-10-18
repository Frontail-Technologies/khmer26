"use client"

import { useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { SellerListingSort } from "../api/sellers.api"

export interface SellerListingUrlFilters {
  q: string
  /** Category id */
  category: string
  sort: SellerListingSort
}

const SORTS: SellerListingSort[] = ["newest", "price_asc", "price_desc"]

/** The URL is the source of truth: ?q=&category=&sort= (defaults are omitted). */
export function useSellerListingFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sortParam = params.get("sort") as SellerListingSort | null
  const filters: SellerListingUrlFilters = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    sort: sortParam && SORTS.includes(sortParam) ? sortParam : "newest",
  }

  const write = (patch: Partial<SellerListingUrlFilters>) => {
    const next = new URLSearchParams(params.toString())
    const merged = { ...filters, ...patch }
    const set = (key: string, value: string, isDefault: boolean) =>
      isDefault ? next.delete(key) : next.set(key, value)
    set("q", merged.q.trim(), merged.q.trim() === "")
    set("category", merged.category, merged.category === "")
    set("sort", merged.sort, merged.sort === "newest")
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  // The keyword box keeps its own text while typing and writes to the URL after a short pause.
  const [text, setText] = useState(filters.q)
  const setKeyword = (value: string) => {
    setText(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => write({ q: value }), 350)
  }

  return {
    filters,
    keyword: text,
    setKeyword,
    setCategory: (category: string) => write({ category }),
    setSort: (sort: SellerListingSort) => write({ sort }),
    clear: () => {
      if (timer.current) clearTimeout(timer.current)
      setText("")
      write({ q: "", category: "", sort: "newest" })
    },
    isFiltered: filters.q.trim() !== "" || filters.category !== "",
  }
}
