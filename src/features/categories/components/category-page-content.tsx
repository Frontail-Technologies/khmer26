"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ListingFeedSkeleton } from "@/features/listings/components/listing-skeletons"
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
import { useLocalizedName } from "@/lib/i18n/localized"

export function CategoryPageSkeleton({ withHeader = true }: { withHeader?: boolean }) {
  const tGenerated = useTranslations("generated")
  return (
    <div aria-busy="true" aria-label={tGenerated("loadingCategory")} className="pt-2">
      {withHeader && (
        <div className="space-y-2 pb-3">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-8 w-64" />
        </div>
      )}
      {/* ResultsToolbar */}
      <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-card px-3 py-2 shadow-2xs sm:px-3.5 sm:py-2.5">
        <Skeleton className="h-4 w-28" />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Skeleton className="h-8 w-9 rounded-lg sm:w-20 lg:hidden" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-[60px] rounded-lg" />
        </div>
      </div>
      <ListingFeedSkeleton count={12} gridClassName="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" />
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
  const getLocalizedName = useLocalizedName()
  const tUi = useTranslations("ui.common")
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

  return (
    <>
      <CategoryPageHeader
        title={getLocalizedName(node)}
        breadcrumbs={getBreadcrumbs(path, { home: tUi("home"), categories: tUi("categories"), name: getLocalizedName })}
        totalCount={state.total}
      />

      <div className="pt-1">
        <SearchResultsView
          state={state}
          categoryNav={categoryNav}
          categoryEmptyState={<CategoryEmptyState />}
        />
      </div>
    </>
  )
}

export function CategoryPageContent({ segments }: { segments: string[] }) {
  const tGenerated = useTranslations("generated")
  const tCat = useTranslations("ui.categoryPage")
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
        title={tGenerated("weCouldnTLoadThisCategory")}
        body={tCat("loadFailed")}
        action={
          <Button size="sm" onClick={() => tree.refetch()}>
            <LocalizedText id="tryAgain" />
          </Button>
        }
      />
    )
  }

  if (!resolved) {
    return (
      <CategoryMessage
        title={tGenerated("categoryNotFound")}
        body={tCat("notFound")}
        action={
          <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
            <LocalizedText id="browseAllCategories" />
          </Link>
        }
      />
    )
  }

  return <CategoryPageBody resolved={resolved} index={index} />
}
