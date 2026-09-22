import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DetailedCategory } from "../data/all-categories"

interface VisualCategoryGridProps {
  categories: DetailedCategory[]
  onCategoryClick?: (slug: string) => void
}

export function VisualCategoryGrid({ categories }: VisualCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group block focus-visible:outline-hidden"
        >
          <Card className="h-full rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardContent className="p-3 sm:p-3.5 flex flex-col items-center text-center h-full justify-between gap-2">
              <div className="relative aspect-square w-full max-w-27.5 sm:max-w-32.5 mx-auto transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-contain"
                />
              </div>

              <div className="w-full space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-primary shrink-0"
                    weight="bold"
                  />
                </div>

                <div className="flex items-center justify-center">
                  <Badge
                    variant="secondary"
                    className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground bg-muted/70 px-2 py-0.5 rounded-full"
                  >
                    {cat.listingCount.toLocaleString()} ads
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
