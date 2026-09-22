import { Container } from "@/components/layout/Container"
import { ResultsHeader } from "@/features/search/components/results-header"
import { ResultsShell } from "@/features/search/components/results-shell"
import { DEMO_SEARCH_LISTINGS } from "@/features/search/data/demo-results-listings"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>
}

function formatCategorySegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryTitle = slug.map(formatCategorySegment).join(" › ")
  return {
    title: `${categoryTitle} in Cambodia`,
    description: `Browse verified ${categoryTitle} listings from trusted sellers across Cambodia on Khmer26.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    ...slug.map((segment, i) => ({
      label: formatCategorySegment(segment),
      href:
        i === slug.length - 1
          ? undefined
          : `/category/${slug.slice(0, i + 1).join("/")}`,
    })),
  ]

  const lastSegment = slug[slug.length - 1] ?? "vehicles"
  const formattedCurrent = formatCategorySegment(lastSegment)
  const pageTitle =
    lastSegment.toLowerCase() === "cars"
      ? "Used Cars in Cambodia"
      : `${formattedCurrent} in Cambodia`

  return (
    <Container className="py-2 pb-14">
      <ResultsHeader
        title={pageTitle}
        totalCount={DEMO_SEARCH_LISTINGS.length}
        breadcrumbs={breadcrumbs}
      />
      <ResultsShell
        initialListings={DEMO_SEARCH_LISTINGS}
        initialCategory={lastSegment}
      />
    </Container>
  )
}
