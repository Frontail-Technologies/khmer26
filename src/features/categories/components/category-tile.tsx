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
      className="group flex h-full flex-col items-center gap-3 rounded-lg border border-border/70 bg-card px-3 py-5 text-center shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 sm:h-20 sm:w-20">
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
      <span className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
        {name}
      </span>
    </Link>
  )
}
