export interface GeneralSettings {
  marketplaceName: string
  supportEmail: string
  supportPhone: string
  primaryLanguage: "km" | "en"
  timezone: string
}

export interface MarketplaceSettings {
  freeListingLimit: number
  defaultListingStatus: "active" | "under_review"
  sellerPostingEnabled: boolean
  listingDurationDays: number
}

export interface PlatformSettings {
  general: GeneralSettings
  marketplace: MarketplaceSettings
}
