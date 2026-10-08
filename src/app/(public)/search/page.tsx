import { Suspense } from "react"
import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SearchPageContent } from "@/features/search/components/search-page-content"
import { CategoryPageSkeleton } from "@/features/categories/components/category-page-content"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Results for "${q}"` : "Search Marketplace Listings",
    description: "Search verified marketplace listings in Cambodia.",
  }
}

export default function SearchPage() {
  return (
    <Container className="py-2 pb-14">
      <Suspense fallback={<CategoryPageSkeleton />}>
        <SearchPageContent />
      </Suspense>
    </Container>
  )
}
