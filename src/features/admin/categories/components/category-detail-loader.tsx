"use client"

import { notFound } from "next/navigation"
import { useAdminCategories } from "../hooks/categories.queries"
import { CategoryDetailWorkspace } from "./category-detail-workspace"

interface CategoryDetailLoaderProps {
  categoryId: string
}

export function CategoryDetailLoader({ categoryId }: CategoryDetailLoaderProps) {
  const { data, isLoading } = useAdminCategories()
  const categories = data ?? []

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-muted-foreground">
        Loading category...
      </div>
    )
  }

  if (!isLoading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-muted-foreground">
        No categories found.
      </div>
    )
  }

  const rootCategory = categories.find((c) => c.id === categoryId)
  if (rootCategory) {
    return (
      <CategoryDetailWorkspace
        key={categoryId}
        category={rootCategory}
        allRootCategories={categories}
      />
    )
  }

  for (const root of categories) {
    const sub = root.subcategories.find((s) => s.id === categoryId)
    if (sub) {
      return (
        <CategoryDetailWorkspace
          key={categoryId}
          category={{ ...sub, parent: root }}
          parentCategory={root}
          allRootCategories={categories}
        />
      )
    }
  }

  notFound()
}
