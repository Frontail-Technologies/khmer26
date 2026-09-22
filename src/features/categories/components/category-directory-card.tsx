import Image from "next/image"
import Link from "next/link"
import {
  Car,
  Buildings,
  DeviceMobile,
  Laptop,
  Armchair,
  TShirt,
  Bicycle,
  Truck,
  Briefcase,
  Wrench,
  Dog,
  Football,
  ArrowRight,
  CaretRight,
  Sparkle,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DetailedCategory } from "../data/all-categories"

interface CategoryDirectoryCardProps {
  category: DetailedCategory
}

function getCategoryIcon(iconName: string) {
  const props = { size: 20, weight: "duotone" as const }
  switch (iconName) {
    case "Car":
      return <Car {...props} />
    case "Buildings":
      return <Buildings {...props} />
    case "DeviceMobile":
      return <DeviceMobile {...props} />
    case "Laptop":
      return <Laptop {...props} />
    case "Armchair":
      return <Armchair {...props} />
    case "TShirt":
      return <TShirt {...props} />
    case "Bicycle":
      return <Bicycle {...props} />
    case "Truck":
      return <Truck {...props} />
    case "Briefcase":
      return <Briefcase {...props} />
    case "Wrench":
      return <Wrench {...props} />
    case "Dog":
      return <Dog {...props} />
    case "Football":
      return <Football {...props} />
    default:
      return <Sparkle {...props} />
  }
}

export function CategoryDirectoryCard({ category }: CategoryDirectoryCardProps) {
  return (
    <Card className="rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl bg-background border border-border/60 p-1 flex items-center justify-center overflow-hidden shadow-2xs">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="60px"
                  className="object-contain p-1"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-primary">{getCategoryIcon(category.iconName)}</span>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {category.name}
                  </Link>
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                  {category.description}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-[10px] font-bold text-primary border-primary/30 bg-primary/5 shrink-0 px-2 py-0.5"
            >
              {category.listingCount.toLocaleString()} ads
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="space-y-1">
                <Link
                  href={`/category/${category.slug}/${sub.slug}`}
                  className="group flex items-center justify-between text-xs font-semibold text-foreground hover:text-primary py-1 px-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal shrink-0 ml-1.5">
                    ({sub.listingCount})
                  </span>
                </Link>

                {sub.children && sub.children.length > 0 && (
                  <div className="flex flex-wrap gap-1 pl-2">
                    {sub.children.map((leaf) => (
                      <Link
                        key={leaf.id}
                        href={`/category/${category.slug}/${sub.slug}/${leaf.slug}`}
                        className="inline-flex items-center text-[10px] text-muted-foreground hover:text-primary transition-colors py-0.5 px-1 rounded hover:bg-muted"
                      >
                        <CaretRight size={10} className="mr-0.5 text-muted-foreground/60" />
                        <span>{leaf.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {category.featuredTags.length > 0 && (
            <div className="pt-2 border-t border-border/50 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Popular in {category.name.split(" ")[0]}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {category.featuredTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded-md transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </div>

      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/10">
        <Link
          href={`/category/${category.slug}`}
          className="flex items-center justify-between text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Explore all {category.name}</span>
          <ArrowRight size={14} weight="bold" />
        </Link>
      </div>
    </Card>
  )
}
