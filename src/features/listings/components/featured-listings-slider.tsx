"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, CaretLeft, CaretRight, Sparkle } from "@phosphor-icons/react"
import type { ListingCard as ListingCardType } from "@/types"
import { ListingCard } from "./listing-card"
import { cn } from "@/lib/utils"

interface FeaturedListingsSliderProps {
  listings: ListingCardType[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function FeaturedListingsSlider({
  listings,
  title = "Featured Listings",
  viewAllHref = "/search?filter=featured",
  className,
}: FeaturedListingsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener("resize", updateScrollState)
    return () => window.removeEventListener("resize", updateScrollState)
  }, [updateScrollState, listings])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.firstElementChild?.clientWidth || 220
    const scrollDistance = cardWidth * (el.clientWidth > 768 ? 2 : 1) + 12
    el.scrollBy({
      left: direction === "left" ? -scrollDistance : scrollDistance,
      behavior: "smooth",
    })
  }

  if (listings.length === 0) {
    return null
  }

  return (
    <section className={cn("py-3 sm:py-4", className)}>
      <div className="flex items-center justify-between gap-3 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="shrink-0 text-accent">
            <Sparkle size={18} weight="fill" />
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous featured listings"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
            >
              <CaretLeft size={14} weight="bold" />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Next featured listings"
              className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <span>View all</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-2.5 sm:gap-3 lg:gap-3.5 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1.5 pt-0.5 scroll-smooth"
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="w-[52vw] min-w-[175px] max-w-[210px] sm:w-[220px] sm:max-w-none md:w-[235px] lg:w-[250px] shrink-0 snap-start select-none"
          >
            <ListingCard
              listing={listing}
              featured={true}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
