import { SectionHeader } from "@/components/shared/SectionHeader"
import { POPULAR_CATEGORIES } from "@/features/categories/data/popular-categories"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"
import { CategoryCard } from "./category-card"

export function CategorySection() {
  return (
    <section className="py-4 sm:py-6">
      <SectionHeader
        title="Popular Categories"
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
        {POPULAR_CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
