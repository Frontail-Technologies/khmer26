import Image from "next/image"
import Link from "next/link"
import { getMediaUrl } from "@/lib/media/get-media-url"
import { cn } from "@/lib/utils"
import type { HomeBanner } from "../api/home.api"
import { resolveBannerDestination } from "../lib/banner-utils"

interface HomepageBannerProps {
  banners: HomeBanner[]
  className?: string
}

export function HomepageBanner({ banners, className }: HomepageBannerProps) {
  const banner = [...banners].sort((a, b) => a.sortOrder - b.sortOrder)[0]

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
          alt={banner.title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1400px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center px-4 sm:px-6 md:px-8">
        <div className="max-w-md sm:max-w-lg space-y-1">
          <h3 className="text-sm sm:text-base md:text-lg font-black text-foreground line-clamp-1">
            {banner.title}
          </h3>
          {banner.destinationLabel && (
            <p className="text-[11px] sm:text-xs font-semibold text-primary line-clamp-1">
              {banner.destinationLabel} →
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className={cn("my-3 sm:my-4", className)}>
      {destinationHref ? (
        <Link
          href={destinationHref}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl sm:rounded-2xl"
          aria-label={banner.title}
        >
          {bannerContent}
        </Link>
      ) : (
        bannerContent
      )}
    </section>
  )
}
