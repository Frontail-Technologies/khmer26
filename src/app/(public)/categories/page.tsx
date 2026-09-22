import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { CategoriesExplorer } from "@/features/categories/components/categories-explorer"
import { ALL_DETAILED_CATEGORIES } from "@/features/categories/data/all-categories"

export const metadata: Metadata = {
  title: "All Categories — Browse Marketplace Classifieds in Cambodia",
  description:
    "Explore all classified categories on Khmer26. Find cars, motorcycles, houses, boreys, smartphones, laptops, jobs, services, and furniture across Cambodia.",
}

export default function CategoriesPage() {
  return (
    <div className="py-4 sm:py-6 md:py-8 pb-16">
      <Container>
        <CategoriesExplorer categories={ALL_DETAILED_CATEGORIES} />
      </Container>
    </div>
  )
}
