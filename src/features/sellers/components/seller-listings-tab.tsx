"use client"

import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  X,
  Funnel,
  SortAscending,
  Storefront,
} from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ListingGrid } from "@/features/listings/components/listing-grid"
import { EmptyState } from "@/components/shared/EmptyState"
import type { ListingCard as ListingCardType } from "@/types"

interface SellerListingsTabProps {
  initialListings: ListingCardType[]
  sellerName: string
}

type SortOption = "newest" | "price-asc" | "price-desc"

export function SellerListingsTab({
  initialListings,
  sellerName,
}: SellerListingsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [visibleCount, setVisibleCount] = useState(8)

  const categories = useMemo(() => {
    const set = new Set<string>()
    initialListings.forEach((item) => {
      if (item.categoryPath && item.categoryPath.length > 0) {
        const topCat = item.categoryPath[0]
        if (topCat) {
          set.add(topCat.charAt(0).toUpperCase() + topCat.slice(1))
        }
      }
    })
    return ["All", ...Array.from(set)]
  }, [initialListings])

  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        const matchesSearch =
          !searchQuery.trim() ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          item.location.label.toLowerCase().includes(searchQuery.toLowerCase().trim())

        const matchesCategory =
          selectedCategory === "all" ||
          item.categoryPath.some(
            (c) => c.toLowerCase() === selectedCategory.toLowerCase()
          )

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price
        if (sortBy === "price-desc") return b.price - a.price
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [initialListings, searchQuery, selectedCategory, sortBy])

  const displayedListings = filteredListings.slice(0, visibleCount)
  const hasMore = visibleCount < filteredListings.length

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder={`Search ${sellerName}'s listings...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setVisibleCount(8)
            }}
            className="h-10 pl-9 pr-8 text-xs sm:text-sm bg-muted/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <Funnel size={16} className="text-muted-foreground shrink-0" />
            <div className="flex gap-1">
              {categories.map((cat) => {
                const isSelected =
                  (cat === "All" && selectedCategory === "all") ||
                  selectedCategory.toLowerCase() === cat.toLowerCase()

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat === "All" ? "all" : cat)
                      setVisibleCount(8)
                    }}
                    className={`h-8 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-2">
            <Select
              value={sortBy}
              onValueChange={(val) => val && setSortBy(val as SortOption)}
            >
              <SelectTrigger
                aria-label="Sort listings"
                className="h-9 px-3 text-xs font-semibold rounded-xl bg-background border-border/80 text-foreground gap-2 min-w-36.25"
              >
                <div className="flex items-center gap-1.5">
                  <SortAscending size={15} className="text-primary shrink-0" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent side="bottom" align="end">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {displayedListings.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {displayedListings.length} of {filteredListings.length} active listings
            </span>
          </div>

          <ListingGrid listings={displayedListings} />

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="h-10 px-6 text-xs sm:text-sm font-semibold rounded-lg border-border hover:bg-muted"
              >
                Load More Listings
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Storefront size={32} aria-hidden="true" />}
          title="No listings found"
          description={
            searchQuery || selectedCategory !== "all"
              ? "No items match your search or filter criteria. Try clearing the filter."
              : `${sellerName} has no active listings at this moment.`
          }
          action={
            searchQuery || selectedCategory !== "all"
              ? {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  },
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
