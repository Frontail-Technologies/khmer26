"use client"

import { useTranslations } from "next-intl"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { cn } from "@/lib/utils"
import type { HomeBanner } from "../api/home.api"
import { resolveBannerDestination } from "../lib/banner-utils"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"

interface HomepageBannerProps {
  banners: HomeBanner[]
  className?: string
}

export function HomepageBanner({ banners, className }: HomepageBannerProps) {
  const tGenerated = useTranslations("generated")
  const localized = useLocalizedText()
  const orderedBanners = useMemo(
    () => [...banners].sort((a, b) => a.sortOrder - b.sortOrder),
    [banners]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const resolvedIndex = Math.min(activeIndex, Math.max(orderedBanners.length - 1, 0))
  const banner = orderedBanners[resolvedIndex]

  if (!banner) return null

  const destinationHref = resolveBannerDestination(
    banner.destinationType,
    banner.destinationValue
  )
  const imageUrl = getMediaUrl(banner.imageR2Key)

  const bannerContent = (
    <div className="relative w-full aspect-[21/6] sm:aspect-[21/5] md:aspect-[21/4] min-h-[90px] sm:min-h-[120px] rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-muted shadow-2xs group">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={localized(banner.title, banner.titleKm)}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1400px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center px-4 sm:px-6 md:px-8">
        <div className="max-w-md sm:max-w-lg space-y-1">
          <h3 className="text-sm sm:text-base md:text-lg font-black text-foreground line-clamp-1">
            {localized(banner.title, banner.titleKm)}
          </h3>
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
    <section className={cn("relative my-3 sm:my-4", className)} aria-label={tGenerated("homepageBanners")}>
      {destinationHref ? (
        <Link
          href={destinationHref}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl sm:rounded-2xl"
          aria-label={localized(banner.title, banner.titleKm)}
        >
          {bannerContent}
        </Link>
      ) : (
        bannerContent
      )}
      {orderedBanners.length > 1 && (
        <>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full shadow-sm"
            onClick={() => setActiveIndex(
              resolvedIndex === 0 ? orderedBanners.length - 1 : resolvedIndex - 1
            )}
            aria-label={tGenerated("previousBanner")}
          >
            <CaretLeft size={15} weight="bold" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 z-10 size-8 -translate-y-1/2 rounded-full shadow-sm"
            onClick={() => setActiveIndex((resolvedIndex + 1) % orderedBanners.length)}
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
                  "size-2 rounded-full border border-background/70 transition-colors",
                  index === resolvedIndex ? "bg-primary" : "bg-background/70"
                )}
                onClick={() => setActiveIndex(index)}
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
