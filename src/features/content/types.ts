export type ContentPageSlug = "terms" | "privacy" | "posting-rules"

export interface ContentPageSection {
  id: string
  title: string
  paragraphs: string[]
  items: string[]
}

export interface ContentPage {
  id: string
  slug: ContentPageSlug
  eyebrow: string
  title: string
  summary: string
  sections: ContentPageSection[]
  eyebrowKm?: string | null
  titleKm?: string | null
  summaryKm?: string | null
  sectionsKm?: ContentPageSection[] | null
  isPublished: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PublicSafetyTip {
  id: string
  tip: string
  tipKm?: string | null
  context: "listing_detail" | "chat_messages" | "general_safety" | "homepage"
  sortOrder: number
}

export interface ModerationKeyword {
  id: string
  keyword: string
  guidance: string | null
}

export interface ListingModerationMatch extends ModerationKeyword {
  keywordId: string
  field: "title" | "description"
}
