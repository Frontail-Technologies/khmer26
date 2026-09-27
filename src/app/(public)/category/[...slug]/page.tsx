import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { resolveCategoryFromSlugs } from "@/features/categories/lib/category-taxonomy"
import { CategoryPageHeader } from "@/features/categories/components/category-page-header"
import { SubcategoryDiscovery } from "@/features/categories/components/subcategory-discovery"
import { CategorySiblingNav } from "@/features/categories/components/category-sibling-nav"
import { CategoryResultsShell } from "@/features/categories/components/category-results-shell"
import { ALL_MARKETPLACE_LISTINGS } from "@/features/search/data/all-marketplace-listings"

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const taxonomy = resolveCategoryFromSlugs(slug)

  if (!taxonomy) {
    return {
      title: "Category in Cambodia — Khmer26",
      description: "Browse verified classified listings in Cambodia on Khmer26.",
    }
  }

  const { title, rootCategory, isRoot } = taxonomy
  const pageTitle = isRoot
    ? `${rootCategory.name} in Cambodia — Khmer26`
    : `${title} — ${rootCategory.name} in Cambodia — Khmer26`

  const description = isRoot
    ? rootCategory.description
    : `Find verified ${title} listings in ${rootCategory.name} from trusted sellers across Cambodia on Khmer26.`

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const taxonomy = resolveCategoryFromSlugs(slug)

  if (!taxonomy) {
    notFound()
  }

  return (
    <Container className="py-2 pb-14">
      <CategoryPageHeader
        taxonomy={taxonomy}
        totalCount={
          taxonomy.currentSubcategory
            ? taxonomy.currentSubcategory.listingCount
            : taxonomy.rootCategory.listingCount
        }
      />

      {taxonomy.isRoot ? (
        <SubcategoryDiscovery taxonomy={taxonomy} />
      ) : (
        <CategorySiblingNav taxonomy={taxonomy} />
      )}

      <CategoryResultsShell
        taxonomy={taxonomy}
        initialListings={ALL_MARKETPLACE_LISTINGS}
      />
    </Container>
  )
}
