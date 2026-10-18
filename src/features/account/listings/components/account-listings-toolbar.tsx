"use client"

import { useTranslations } from "next-intl"

import { MagnifyingGlass, Funnel, ArrowsDownUp } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { useCategoryTree } from "@/features/categories/api/categories.queries"
import { useLocalizedName } from "@/lib/i18n/localized"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export type ListingSortOption =
  | "newest"
  | "oldest"
  | "most_viewed"
  | "price_high_low"
  | "price_low_high"

interface AccountListingsToolbarProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  categoryFilter: string
  onCategoryFilterChange: (val: string) => void
  sortOption: ListingSortOption
  onSortOptionChange: (val: ListingSortOption) => void
}

const SORT_LABEL_KEYS = {
  newest: "sortNewest",
  oldest: "sortOldest",
  most_viewed: "sortMostViewed",
  price_high_low: "sortPriceHighLow",
  price_low_high: "sortPriceLowHigh",
} as const satisfies Record<ListingSortOption, string>

export function AccountListingsToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortOption,
  onSortOptionChange,
}: AccountListingsToolbarProps) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.myListings")
  const getLocalizedName = useLocalizedName()
  const { data: categoryTree = [] } = useCategoryTree()
  const categoryOptions = [
    { value: "all", label: t("allCategories") },
    ...categoryTree.map((category) => ({ value: category.id, label: getLocalizedName(category) })),
  ]
  const sortOptions = (Object.keys(SORT_LABEL_KEYS) as ListingSortOption[]).map((value) => ({
    value,
    label: t(SORT_LABEL_KEYS[value]),
  }))
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      <div className="relative flex-1">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          type="search"
          placeholder={tGenerated("searchMyListings")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs sm:text-sm bg-background"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 sm:w-44">
          <Select
            value={categoryFilter}
            items={categoryOptions}
            onValueChange={(val) => onCategoryFilterChange(val as string)}
          >
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
              <div className="flex items-center gap-1.5 truncate">
                <Funnel size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder={tGenerated("category")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-xs">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 sm:w-44">
          <Select
            value={sortOption}
            items={sortOptions}
            onValueChange={(val) => onSortOptionChange(val as ListingSortOption)}
          >
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
              <div className="flex items-center gap-1.5 truncate">
                <ArrowsDownUp size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder={tGenerated("sortBy")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
