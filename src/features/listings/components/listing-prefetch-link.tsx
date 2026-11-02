"use client"

import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useRef, type ComponentProps } from "react"
import { listingDetailQueryOptions } from "../api/listing-detail.queries"

type ListingPrefetchLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { slug: string }

/**
 * Link to a listing that starts loading its details the moment intent shows (hover, touch, focus),
 * so the detail page usually opens with content instead of a skeleton. The router cache keeps the
 * page itself; React Query dedupes and keeps the data for 30s.
 */
export function ListingPrefetchLink({ slug, onPointerEnter, onTouchStart, onFocus, ...props }: ListingPrefetchLinkProps) {
  const queryClient = useQueryClient()
  const done = useRef(false)
  const warm = useCallback(() => {
    if (done.current) return
    done.current = true
    void queryClient.prefetchQuery(listingDetailQueryOptions(slug))
  }, [queryClient, slug])

  return (
    <Link
      href={`/listing/${slug}`}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") warm(); onPointerEnter?.(e) }}
      onTouchStart={(e) => { warm(); onTouchStart?.(e) }}
      onFocus={(e) => { warm(); onFocus?.(e) }}
      {...props}
    />
  )
}
