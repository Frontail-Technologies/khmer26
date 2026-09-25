import type { PlatformSettings } from "../types"

export const DEMO_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    marketplaceName: "Khmer26 Marketplace",
    supportEmail: "support@khmer26.com",
    supportPhone: "+855 23 999 888",
    primaryLanguage: "km",
    timezone: "Asia/Phnom_Penh",
  },
  marketplace: {
    freeListingLimit: 3,
    defaultListingStatus: "active",
    sellerPostingEnabled: true,
    listingDurationDays: 30,
  },
}
