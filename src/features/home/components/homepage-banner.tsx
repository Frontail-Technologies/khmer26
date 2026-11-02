"use client"

import { useTranslations } from "next-intl"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { cn } from "@/lib/utils"
import { SNAP_TRACK_CLASS, useSnapCarousel } from "@/hooks/use-snap-carousel"
import type { HomeBanner } from "../api/home.api"
import { resolveBannerDestination } from "../lib/banner-utils"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"

interface HomepageBannerProps {
  banners: HomeBanner[]
  className?: string
}

const AUTOPLAY_MS = 5000

export function HomepageBanner({ banners, className }: HomepageBannerProps) {
  const tGenerated = useTranslations("generated")
  const localized = useLocalizedText()
  const orderedBanners = useMemo(
    () => [...banners].sort((a, b) => a.sortOrder - b.sortOrder),
    [banners]
  )
  const count = orderedBanners.length
  const [activeIndex, setActiveIndex] = useState(0)
  const resolvedIndex = Math.min(activeIndex, Math.max(count - 1, 0))
  const { trackRef, onScroll, onPointerDown, goTo } = useSnapCarousel(resolvedIndex, setActiveIndex, count)
  const [paused, setPaused] = useState(false)

  // Gentle autoplay; stops while the visitor is touching/hovering or the tab is hidden.
  useEffect(() => {
    if (count < 2 || paused) return
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduced) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") goTo(resolvedIndex + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [count, paused, goTo, resolvedIndex])

  if (count === 0) return null

  return (
    <section
      className={cn("relative my-3 sm:my-4", className)}
      aria-label={tGenerated("homepageBanners")}
      aria-roledescription="carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), AUTOPLAY_MS)}
    >
      <div className="relative w-full aspect-[21/6] sm:aspect-[21/5] md:aspect-[21/4] min-h-[90px] sm:min-h-[120px] rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-muted shadow-2xs">
        <div ref={trackRef} onScroll={onScroll} onPointerDown={onPointerDown} className={cn(SNAP_TRACK_CLASS, "absolute inset-0")}>
          {orderedBanners.map((banner, index) => {
            const title = localized(banner.title, banner.titleKm)
            const href = resolveBannerDestination(banner.destinationType, banner.destinationValue)
            const imageUrl = getMediaUrl(banner.imageR2Key)
            const slide = (
              <div className="group relative h-full w-full">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority={index === 0}
                    // Few banners and they're the hero: load all up front so slides never wait.
                    loading={index === 0 ? undefined : "eager"}
                    draggable={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center px-4 sm:px-6 md:px-8">
                  <div className="max-w-md sm:max-w-lg space-y-1">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-foreground line-clamp-1">{title}</h3>
                    {banner.destinationLabel && (
                      <p className="text-xxs sm:text-xs font-semibold text-primary line-clamp-1">
                        {localized(banner.destinationLabel, banner.destinationLabelKm)} →
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
            return (
              <div
                key={banner.id}
                className="relative h-full w-full shrink-0 snap-center snap-always"
                aria-hidden={index !== resolvedIndex}
                inert={index !== resolvedIndex}
              >
                {href ? (
                  <Link
                    href={href}
                    draggable={false}
                    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    aria-label={title}
                  >
                    {slide}
                  </Link>
                ) : (
                  slide
                )}
              </div>
            )
          })}
        </div>
      </div>
      {count > 1 && (
        <>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full shadow-sm max-sm:hidden"
            onClick={() => goTo(resolvedIndex - 1)}
            aria-label={tGenerated("previousBanner")}
          >
            <CaretLeft size={15} weight="bold" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full shadow-sm max-sm:hidden"
            onClick={() => goTo(resolvedIndex + 1)}
            aria-label={tGenerated("nextBanner")}
          >
            <CaretRight size={15} weight="bold" />
          </Button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {orderedBanners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  "h-2 rounded-full border border-background/70 transition-all duration-300",
                  index === resolvedIndex ? "w-5 bg-primary" : "w-2 bg-background/70"
                )}
                onClick={() => goTo(index)}
                aria-label={`Show banner ${index + 1}`}
                aria-current={index === resolvedIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
