import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export interface CategoryCardData {
  id: string
  name: string
  slug: string
  imageUrl: string | null
}

interface CategoryCardProps {
  category: CategoryCardData
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group flex flex-col items-center justify-start text-center focus-visible:outline-hidden",
        className
      )}
    >
      <div className="relative flex aspect-square w-full items-center justify-center p-1 sm:p-2 transition-transform duration-200 group-hover:scale-105">
        <div className="relative h-full w-full">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
              className="object-contain"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-2xl bg-muted text-xl sm:text-2xl font-bold text-muted-foreground"
              aria-hidden="true"
            >
              {category.name.trim().charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <span className="mt-1.5 text-xs sm:text-[13px] font-medium text-foreground line-clamp-2 leading-tight transition-colors group-hover:text-primary max-w-30">
        {category.name}
      </span>
    </Link>
  )
}
