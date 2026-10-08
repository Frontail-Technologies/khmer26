import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { lookupCategoryBySlug } from "@/features/categories/api/categories.server"
import {
  CategoryPageContent,
  CategoryPageSkeleton,
} from "@/features/categories/components/category-page-content"

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
  const lookup = await lookupCategoryBySlug(lastSegment(slug))

  if (lookup.status !== "found") {
    return {
      title: "Category in Cambodia — Khmer26",
      description: "Browse verified classified listings in Cambodia on Khmer26.",
    }
  }

  const title = `${lookup.nameEn} in Cambodia — Khmer26`
  const description = `Find verified ${lookup.nameEn} listings from trusted sellers across Cambodia on Khmer26.`
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
