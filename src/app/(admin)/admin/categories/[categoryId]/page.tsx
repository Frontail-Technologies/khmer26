import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryDetailWorkspace } from "@/features/admin/categories/components/category-detail-workspace"
import {
  DEMO_ADMIN_CATEGORIES,
  getCategoryById,
  getSubcategoryById,
} from "@/features/admin/categories/data/demo-admin-categories"

interface AdminCategoryDetailPageProps {
  params: Promise<{ categoryId: string }>
}

export async function generateMetadata({
  params,
}: AdminCategoryDetailPageProps): Promise<Metadata> {
  const { categoryId } = await params
  const root = getCategoryById(categoryId)
  const sub = getSubcategoryById(categoryId)
  const title = root?.name || sub?.subcategory.name || "Category Details"

  return {
    title: `${title} | Category Management`,
    description: `Configure category details and taxonomy settings for ${title}.`,
  }
}

export default async function AdminCategoryDetailPage({
  params,
}: AdminCategoryDetailPageProps) {
  const { categoryId } = await params

  const rootCategory = getCategoryById(categoryId)
  const subcategoryMatch = getSubcategoryById(categoryId)

  if (!rootCategory && !subcategoryMatch) {
    notFound()
  }

  if (rootCategory) {
    return (
      <CategoryDetailWorkspace
        category={rootCategory}
        allRootCategories={DEMO_ADMIN_CATEGORIES}
      />
    )
  }

  if (subcategoryMatch) {
    return (
      <CategoryDetailWorkspace
        category={{
          ...subcategoryMatch.subcategory,
          parent: subcategoryMatch.parent,
        }}
        parentCategory={subcategoryMatch.parent}
        allRootCategories={DEMO_ADMIN_CATEGORIES}
      />
    )
  }

  notFound()
}
