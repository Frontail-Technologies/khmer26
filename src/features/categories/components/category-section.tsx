import { SectionHeader } from "@/components/shared/SectionHeader"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { CategoryCard, type CategoryCardData } from "./category-card"

interface CategorySectionProps {
  categories: CategoryCardData[]
  title?: string
}

export function CategorySection({
  categories,
  title = "Popular Categories",
}: CategorySectionProps) {
  if (categories.length === 0) return null

  return (
    <section className="py-4 sm:py-6">
      <SectionHeader
        title={title}
        action={
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        }
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 pt-1">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
