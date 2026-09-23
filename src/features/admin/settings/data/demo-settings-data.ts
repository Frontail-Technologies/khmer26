import type { PlatformSettings } from "../types"

export const DEMO_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    marketplaceName: "Khmer26 Marketplace Cambodia",
    supportEmail: "support@khmer26.com",
    supportPhone: "+855 23 999 260",
    defaultCurrency: "USD",
    defaultLanguage: "km",
    timezone: "Asia/Phnom_Penh (GMT+7)",
  },
  marketplace: {
    defaultListingDurationDays: 60,
    listingApprovalMode: "ai_flagged_only",
    maxImagesPerListing: 12,
    freeTierListingLimit: 5,
    allowInstantChat: true,
    requirePhoneVerification: true,
  },
  moderation: {
    autoFlagSuspiciousKeywords: true,
    autoHoldHighValueListings: true,
    highValueThresholdUsd: 50000,
    maxReportsBeforeAutoDelist: 5,
    requireIdForVehicleRealEstate: true,
  },
  communication: {
    senderEmail: "no-reply@khmer26.com",
    fcmPushConfigured: true,
    smsGatewayProvider: "Cellcard / Smart SMS Gateway",
    telegramBotAlerts: true,
  },
  security: {
    sessionTimeoutHours: 12,
    twoFactorRequirement: "all_staff",
    maxLoginAttempts: 5,
    ipWhitelistingEnabled: false,
  },
}
