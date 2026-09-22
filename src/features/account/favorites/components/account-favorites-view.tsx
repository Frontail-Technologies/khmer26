"use client"

import { useState, useMemo } from "react"
import {
  Heart,
  MagnifyingGlass,
  Funnel,
  ArrowsDownUp,
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { EmptyState } from "@/components/shared/EmptyState"
import { AccountPageHeader } from "../../components/account-page-header"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { DEMO_LISTINGS } from "@/features/listings/data/demo-listings"
import type { ListingCard as ListingCardType } from "@/types"

export type FavoriteSortOption =
  | "recent"
  | "newest"
  | "price_low_high"
  | "price_high_low"

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "vehicles", label: "Vehicles" },
  { value: "electronics", label: "Electronics" },
  { value: "property", label: "Property" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "home", label: "Home & Garden" },
]

export function AccountFavoritesView() {
  const [favorites] = useState<ListingCardType[]>(() =>
    DEMO_LISTINGS.slice(0, 6).map((item) => ({ ...item, isFavorited: true }))
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState<FavoriteSortOption>("recent")

  const filteredFavorites = useMemo(() => {
    return favorites
      .filter((item) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.location.label.toLowerCase().includes(q)
        )
      })
      .filter((item) => {
        if (categoryFilter === "all") return true
        return item.categoryPath.some((cat) =>
          cat.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      })
      .sort((a, b) => {
        if (sortOption === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        if (sortOption === "price_low_high") {
          return a.price - b.price
        }
        if (sortOption === "price_high_low") {
          return b.price - a.price
        }
        return 0
      })
  }, [favorites, searchQuery, categoryFilter, sortOption])

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Saved Listings"
        description="Listings you have saved for later."
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="search"
              placeholder="Search saved listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 sm:w-44">
              <Select
                value={categoryFilter}
                onValueChange={(val) => setCategoryFilter(val as string)}
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
                onValueChange={(val) => setSortOption(val as FavoriteSortOption)}
              >
                <SelectTrigger className="h-9 text-xs sm:text-sm bg-background">
                  <div className="flex items-center gap-1.5 truncate">
                    <ArrowsDownUp size={14} className="text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Sort By" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent" className="text-xs">
                    Recently Saved
                  </SelectItem>
                  <SelectItem value="newest" className="text-xs">
                    Newest Listing
                  </SelectItem>
                  <SelectItem value="price_low_high" className="text-xs">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price_high_low" className="text-xs">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredFavorites.length > 0 ? (
          <ListingGrid
            listings={filteredFavorites}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 p-6 sm:p-10 bg-card/40">
            {searchQuery || categoryFilter !== "all" ? (
              <EmptyState
                icon={<MagnifyingGlass size={32} className="text-muted-foreground" />}
                title="No saved listings match"
                description="Try changing your search term or category filter."
                action={{
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("")
                    setCategoryFilter("all")
                  },
                }}
              />
            ) : (
              <EmptyState
                icon={<Heart size={32} className="text-muted-foreground" />}
                title="No saved listings yet"
                description="Browse marketplace listings and click the heart icon to save listings for later."
                action={{
                  label: "Browse Marketplace",
                  href: "/search",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
