import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { lookupCategoryBySlug } from "@/features/categories/api/categories.server"
import {
  CategoryPageContent,
  CategoryPageSkeleton,
} from "@/features/categories/components/category-page-content"
import { getLocale } from "next-intl/server"

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>
}

function lastSegment(slug: string[]): string {
  const last = slug[slug.length - 1] ?? ""
  try {
    return decodeURIComponent(last)
  } catch {
    return last
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const lookup = await lookupCategoryBySlug(lastSegment(slug))

  if (lookup.status !== "found") {
    return {
      title: locale === "km" ? "ប្រភេទទំនិញនៅកម្ពុជា — offerupkh" : "Category in Cambodia — offerupkh",
      description: locale === "km" ? "ស្វែងរកការផ្សាយពាណិជ្ជកម្មដែលបានផ្ទៀងផ្ទាត់នៅកម្ពុជាលើ offerupkh។" : "Browse verified classified listings in Cambodia on offerupkh.",
    }
  }

  const categoryName = locale === "km" && lookup.nameKm?.trim() ? lookup.nameKm : lookup.nameEn
  const title = locale === "km" ? `${categoryName} នៅកម្ពុជា — offerupkh` : `${categoryName} in Cambodia — offerupkh`
  const description = locale === "km"
    ? `ស្វែងរកការផ្សាយ ${categoryName} ដែលបានផ្ទៀងផ្ទាត់ពីអ្នកលក់ដែលអាចទុកចិត្តបាននៅកម្ពុជាលើ offerupkh។`
    : `Find verified ${categoryName} listings from trusted sellers across Cambodia on offerupkh.`
  return { title, description, openGraph: { title, description, type: "website" } }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  if ((await lookupCategoryBySlug(lastSegment(slug))).status === "not-found") {
    notFound()
  }

  return (
    <Container className="py-2 pb-14">
      <Suspense fallback={<CategoryPageSkeleton />}>
        <CategoryPageContent segments={slug} />
      </Suspense>
    </Container>
  )
}
