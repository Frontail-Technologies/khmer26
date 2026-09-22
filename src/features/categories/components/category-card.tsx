import type { VisualCategory } from "@/features/categories/data/popular-categories"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface CategoryCardProps {
  category: VisualCategory
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
          <Image
            src={category.imageUrl}
            alt={category.imageAlt}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
            className="object-contain"
          />
        </div>
      </div>
      <span className="mt-1.5 text-xs sm:text-[13px] font-medium text-foreground line-clamp-2 leading-tight transition-colors group-hover:text-primary max-w-30">
        {category.name}
      </span>
    </Link>
  )
}
