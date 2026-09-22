"use client"

import { MagnifyingGlass, Funnel, ArrowsDownUp } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
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

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "vehicles", label: "Vehicles" },
  { value: "electronics", label: "Electronics" },
  { value: "property", label: "Property" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "home", label: "Home & Garden" },
]

export function AccountListingsToolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortOption,
  onSortOptionChange,
}: AccountListingsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      <div className="relative flex-1">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          type="search"
          placeholder="Search my listings..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs sm:text-sm bg-background"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 sm:w-44">
          <Select
            value={categoryFilter}
            onValueChange={(val) => onCategoryFilterChange(val as string)}
          >
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
              <div className="flex items-center gap-1.5 truncate">
                <Funnel size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
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
            onValueChange={(val) => onSortOptionChange(val as ListingSortOption)}
          >
            <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
              <div className="flex items-center gap-1.5 truncate">
                <ArrowsDownUp size={14} className="text-muted-foreground shrink-0" />
                <SelectValue placeholder="Sort By" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs">
                Newest
              </SelectItem>
              <SelectItem value="oldest" className="text-xs">
                Oldest
              </SelectItem>
              <SelectItem value="most_viewed" className="text-xs">
                Most Viewed
              </SelectItem>
              <SelectItem value="price_high_low" className="text-xs">
                Price: High to Low
              </SelectItem>
              <SelectItem value="price_low_high" className="text-xs">
                Price: Low to High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
