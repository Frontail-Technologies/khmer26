export interface HomepageSectionConfig {
  id: string
  title: string
  subtitle?: string
  type: "hero_slider" | "categories_grid" | "featured_listings" | "location_browser" | "trust_banner" | "recent_listings"
  isEnabled: boolean
  sortOrder: number
  itemCount?: number
}

export interface PopularCategoryItem {
  id: string
  name: string
  slug: string
  imageUrl: string
  parentCategoryName?: string
  listingCount: number
  sortOrder: number
}

export type FeaturedSourceType = "category" | "latest" | "featured" | "most_viewed"
export type FeaturedSortMode = "recent" | "price_low" | "price_high" | "featured"

export interface FeaturedSectionItem {
  id: string
  title: string
  slug: string
  sourceType: FeaturedSourceType
  categoryIds: string[]
  categoryNames: string[]
  sortMode: FeaturedSortMode
  displayStyle: "grid"
  isActive: boolean
  sortOrder: number
  itemsCount: number
}

export type BannerPlacement = "homepage_hero" | "homepage_cta" | "category_header" | "listing_sidebar"
export type BannerDestinationType = "no_action" | "category" | "listing" | "url"

export interface AdminBannerItem {
  id: string
  title: string
  placement: BannerPlacement
  imageUrl: string
  mobileImageUrl?: string
  destinationType: BannerDestinationType
  destinationValue: string
  destinationLabel?: string
  startDate?: string
  endDate?: string
  isActive: boolean
  sortOrder: number
  clicksCount?: number
  viewsCount?: number
}

export type SafetyTipContext = "listing_detail" | "chat_messages" | "general_safety"

export interface SafetyTipItem {
  id: string
  tip: string
  context: SafetyTipContext
  isActive: boolean
  sortOrder: number
}

export interface StaticPageItem {
  id: string
  title: string
  slug: string
  category: string
  status: "published" | "draft"
  updatedAt: string
  content: string
}
