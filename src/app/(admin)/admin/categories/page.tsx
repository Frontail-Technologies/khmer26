import type { Metadata } from "next"
import { CategoryTreeList } from "@/features/admin/categories/components/category-tree-list"
import { DEMO_ADMIN_CATEGORIES } from "@/features/admin/categories/data/demo-admin-categories"

export const metadata: Metadata = {
  title: "Categories & Taxonomies",
  description: "Manage marketplace root categories and subcategories.",
}

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-4">
      <CategoryTreeList categories={DEMO_ADMIN_CATEGORIES} />
    </div>
  )
}
