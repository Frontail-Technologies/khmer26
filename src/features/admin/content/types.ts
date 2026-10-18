export interface HomepageSectionConfig {
  id: string
  title: string
  titleKm?: string | null
  subtitle?: string
  subtitleKm?: string | null
  type: "hero_slider" | "categories_grid" | "featured_listings" | "location_browser" | "trust_banner" | "recent_listings"
  isEnabled: boolean
  sortOrder: number
  itemCount?: number
}

export type HomepageLayoutItem =
  | (HomepageSectionConfig & { kind: "builtin" })
  | {
      kind: "featured"
      id: string
      title: string
      titleKm?: string | null
      subtitle?: string
      subtitleKm?: string | null
      type: "featured_section"
      isEnabled: boolean
      sortOrder: number
      sourceType: FeaturedSourceType
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
  titleKm: string | null
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
  titleKm?: string | null
  placement: BannerPlacement
  imageUrl: string
  imageMediaId?: string
  mobileImageUrl?: string
  destinationType: BannerDestinationType
  destinationValue: string
  destinationLabel?: string
  destinationLabelKm?: string | null
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
  tipKm: string | null
  context: SafetyTipContext
  isActive: boolean
  sortOrder: number
}

export type ContentPageSlug = "terms" | "privacy" | "posting-rules"

export interface ContentPageSection {
  id: string
  title: string
  paragraphs: string[]
  items: string[]
}

export interface AdminContentPage {
  id: string
  slug: ContentPageSlug
  eyebrow: string
  title: string
  summary: string
  sections: ContentPageSection[]
  eyebrowKm: string | null
  titleKm: string | null
  summaryKm: string | null
  sectionsKm: ContentPageSection[] | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ModerationKeywordItem {
  id: string
  keyword: string
  normalizedKeyword: string
  guidance: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

