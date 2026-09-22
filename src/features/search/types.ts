import type { ListingCard } from "@/types"

export type SortOption = "recommended" | "newest" | "price_asc" | "price_desc"

export interface FilterState {
  category?: string
  location?: string
  brands: string[]
  minPrice?: number
  maxPrice?: number
  yearFrom?: number
  yearTo?: number
  conditions: string[]
  fuels: string[]
  transmissions: string[]
  sellerTypes: string[]
  verifiedOnly?: boolean
  featuredOnly?: boolean
  withPhotosOnly?: boolean
  searchQuery?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface SearchResultsContext {
  title: string
  description?: string
  totalCount: number
  breadcrumbs: BreadcrumbItem[]
  initialQuery?: string
  initialCategory?: string
  listings: ListingCard[]
}
