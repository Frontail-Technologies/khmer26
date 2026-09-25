import Image from "next/image"
import Link from "next/link"
import { DEMO_ADMIN_BANNERS } from "@/features/admin/content/data/demo-content-data"
import { cn } from "@/lib/utils"

interface HomepageBannerProps {
  className?: string
}

function resolveBannerDestination(type: string, value: string): string | null {
  if (!value || type === "no_action") return null
  if (type === "category") return `/search?category=${encodeURIComponent(value)}`
  if (type === "listing") return `/listing/${encodeURIComponent(value)}`
  return value
}

export function HomepageBanner({ className }: HomepageBannerProps) {
  const banner = DEMO_ADMIN_BANNERS.find(
    (b) => b.isActive && b.placement === "homepage_hero"
  )

  if (!banner) {
    return null
  }

  const destinationHref = resolveBannerDestination(
    banner.destinationType,
    banner.destinationValue
  )

  const bannerContent = (
    <div className="relative w-full aspect-[21/6] sm:aspect-[21/5] md:aspect-[21/4] min-h-[90px] sm:min-h-[120px] rounded-xl sm:rounded-2xl overflow-hidden border border-border/70 bg-muted shadow-2xs group">
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        priority
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1400px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent flex items-center px-4 sm:px-6 md:px-8">
        <div className="max-w-md sm:max-w-lg space-y-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-2xs">
            Marketplace Event
          </span>
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
