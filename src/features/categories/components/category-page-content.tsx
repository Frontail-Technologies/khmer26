"use client"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchPageState } from "@/features/search/hooks/use-search-page-state"
import { SearchResultsView } from "@/features/search/components/search-results-view"
import type { CategoryNavData } from "@/features/search/components/filter-panel"
import { serializeSearchFilters } from "@/features/search/lib/search-filters"
import { carryFiltersToCategory } from "@/features/search/lib/carry-filters"
import { useCategoryTree } from "../api/categories.queries"
import {
  buildCategoryIndex,
  getBreadcrumbs,
  getCategoryHref,
  getCategoryPath,
  resolveCategoryFromSegments,
  type CategoryIndex,
  type ResolvedCategory,
} from "../lib/category-tree"
import { CategoryEmptyState } from "./category-empty-state"
import { CategoryPageHeader } from "./category-page-header"

export function CategoryPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading category" className="space-y-4 pt-2">
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-8 w-72" />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-16/10 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

function CategoryMessage({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action: React.ReactNode
}) {
  return (
    <div className="my-10 rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 text-center">
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      <div className="mt-5 flex items-center justify-center gap-2.5">{action}</div>
    </div>
  )
}

function CategoryPageBody({ resolved, index }: { resolved: ResolvedCategory; index: CategoryIndex }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { node, path } = resolved
  const state = useSearchPageState({ fixedCategory: node.slug })
  const { filters } = state

  const categoryNav = useMemo<CategoryNavData>(
    () => ({
      roots: index.roots,
      ancestorIds: path.map((n) => n.id),
      onSelect: (slug) => {
        if (!slug) {
          router.push("/categories")
          return
        }
        const target = index.bySlug.get(slug)
        if (!target) return
        void carryFiltersToCategory(queryClient, filters, slug).then((next) => {
          const carried = serializeSearchFilters(
            { ...next, category: undefined },
            { omitCategory: true }
          ).toString()
          router.push(
            `${getCategoryHref(getCategoryPath(index, target))}${carried ? `?${carried}` : ""}`
          )
        })
      },
    }),
    [index, path, filters, router, queryClient]
  )

  const parent = path[path.length - 2]

  return (
    <>
      <CategoryPageHeader
        title={node.nameEn}
        breadcrumbs={getBreadcrumbs(path)}
        totalCount={state.total}
      />

      <div className="pt-1">
        <SearchResultsView
          state={state}
          categoryNav={categoryNav}
          categoryEmptyState={
            <CategoryEmptyState
              parent={
                parent ? { name: parent.nameEn, href: getCategoryHref(path.slice(0, -1)) } : undefined
              }
            />
          }
        />
      </div>
    </>
  )
}

export function CategoryPageContent({ segments }: { segments: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tree = useCategoryTree()

  const index = useMemo(() => (tree.data ? buildCategoryIndex(tree.data) : null), [tree.data])
  const resolved = useMemo(
    () => (index ? resolveCategoryFromSegments(index, segments) : null),
    [index, segments]
  )

  const query = searchParams.toString()
  useEffect(() => {
    if (resolved && !resolved.isCanonical) {
      router.replace(`${resolved.canonicalHref}${query ? `?${query}` : ""}`)
    }
  }, [resolved, query, router])

  if (tree.isPending) return <CategoryPageSkeleton />

  if (tree.isError || !index) {
    return (
      <CategoryMessage
        title="We couldn't load this category."
        body="Please check your connection and try again."
        action={
          <Button size="sm" onClick={() => tree.refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  if (!resolved) {
    return (
      <CategoryMessage
        title="Category not found"
        body="This category doesn't exist or is no longer available."
        action={
          <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
            Browse all categories
          </Link>
        }
      />
    )
  }

  return <CategoryPageBody resolved={resolved} index={index} />
}
