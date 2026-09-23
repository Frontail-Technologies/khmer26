export interface HomepageSectionConfig {
  id: string
  title: string
  subtitle?: string
  type: "hero_slider" | "categories_grid" | "featured_listings" | "location_browser" | "trust_banner" | "recent_listings"
  isEnabled: boolean
  sortOrder: number
  itemCount?: number
}

export interface AdminBannerItem {
  id: string
  title: string
  placement: "homepage_hero" | "category_header" | "listing_sidebar" | "mobile_interstitial"
  imageUrl: string
  targetUrl: string
  startDate: string
  endDate: string
  isActive: boolean
  clicksCount: number
  viewsCount: number
}

export interface FeaturedItem {
  id: string
  entityId: string
  title: string
  subtitle: string
  imageUrl?: string
  category?: string
  price?: number
  currency?: string
  sortOrder: number
  isActive: boolean
}
