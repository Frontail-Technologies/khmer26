import Image from "next/image"
import Link from "next/link"

interface CategoryTileProps {
  name: string
  href: string
  imageUrl: string | null
}

export function CategoryTile({ name, href, imageUrl }: CategoryTileProps) {
  return (
    <Link
      href={href}
      className="pressable group flex h-full flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card px-1.5 py-3 text-center shadow-2xs transition-all sm:gap-3 sm:rounded-lg sm:px-3 sm:py-5 duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 sm:h-20 sm:w-20">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span
            className="text-2xl font-bold text-primary/70 sm:text-3xl"
            aria-hidden="true"
          >
            {name.trim().charAt(0).toUpperCase()}
          </span>
        )}
      </span>
      <span className="line-clamp-2 text-xs font-medium leading-snug text-foreground sm:text-sm transition-colors group-hover:text-primary sm:text-[15px]">
        {name}
      </span>
    </Link>
  )
}
