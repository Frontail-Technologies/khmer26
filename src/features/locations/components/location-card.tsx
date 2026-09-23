import { cn } from "@/lib/utils"
import type { LocationCity } from "@/features/locations/data/demo-locations"
import { MapPin } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import Link from "next/link"

interface LocationCardProps {
  location: LocationCity
  className?: string
}

export function LocationCard({ location, className }: LocationCardProps) {
  return (
    <Link
      href={`/search?location=${encodeURIComponent(location.name)}`}
      className={cn(
        "group relative flex h-20 sm:h-22 w-full min-w-0 flex-col justify-end overflow-hidden rounded-lg border border-border/50 p-2 sm:p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs focus-visible:outline-hidden",
        className
      )}
    >
      <Image
        src={location.imageUrl}
        alt={location.name}
        fill
        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-1 text-white min-w-0">
          <MapPin size={12} className="shrink-0 text-white/90" aria-hidden="true" />
          <h3 className="text-xs sm:text-[13px] font-bold tracking-tight text-white truncate block">
            {location.name}
          </h3>
        </div>
        <p className="mt-0.5 text-[10px] text-white/80 font-medium truncate block">
          {location.listingCount.toLocaleString("en-US")}+ ads
        </p>
      </div>
    </Link>
  )
}
