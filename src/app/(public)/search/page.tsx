import { Container } from "@/components/layout/Container"
import { ResultsHeader } from "@/features/search/components/results-header"
import { ResultsShell } from "@/features/search/components/results-shell"
import { DEMO_SEARCH_LISTINGS } from "@/features/search/data/demo-results-listings"
import type { Metadata } from "next"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; location?: string; category?: string }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Results for "${q}"` : "Search Marketplace Listings",
    description: `Search verified marketplace listings in Cambodia.`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, location, category } = await searchParams

  const title = q ? `Results for “${q}”` : "All Marketplace Listings"

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Search", href: "/search" },
    ...(q ? [{ label: `“${q}”` }] : []),
  ]

  return (
    <Container className="py-2 pb-14">
      <ResultsHeader
        title={title}
        totalCount={DEMO_SEARCH_LISTINGS.length}
        breadcrumbs={breadcrumbs}
      />
      <ResultsShell
        initialListings={DEMO_SEARCH_LISTINGS}
        initialQuery={q}
        initialLocation={location}
        initialCategory={category}
      />
    </Container>
  )
}
