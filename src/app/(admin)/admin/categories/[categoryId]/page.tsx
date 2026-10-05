import type { Metadata } from "next"
import { CategoryDetailLoader } from "@/features/admin/categories/components/category-detail-loader"

interface AdminCategoryDetailPageProps {
  params: Promise<{ categoryId: string }>
}

export async function generateMetadata({
  params,
}: AdminCategoryDetailPageProps): Promise<Metadata> {
  const { categoryId } = await params

  return {
    title: "Category Details | Category Management",
    description: `Configure category details and taxonomy settings for ${categoryId}.`,
  }
}

export default async function AdminCategoryDetailPage({
  params,
}: AdminCategoryDetailPageProps) {
  const { categoryId } = await params

  return <CategoryDetailLoader categoryId={categoryId} />
}
