export interface PlatformSettings {
  general: {
    marketplaceName: string
    supportEmail: string
    supportPhone: string
    defaultCurrency: "USD" | "KHR"
    defaultLanguage: "km" | "en"
    timezone: string
  }
  marketplace: {
    defaultListingDurationDays: number
    listingApprovalMode: "auto_approve" | "manual_review" | "ai_flagged_only"
    maxImagesPerListing: number
    freeTierListingLimit: number
    allowInstantChat: boolean
    requirePhoneVerification: boolean
  }
  moderation: {
    autoFlagSuspiciousKeywords: boolean
    autoHoldHighValueListings: boolean
    highValueThresholdUsd: number
    maxReportsBeforeAutoDelist: number
    requireIdForVehicleRealEstate: boolean
  }
  communication: {
    senderEmail: string
    fcmPushConfigured: boolean
    smsGatewayProvider: string
    telegramBotAlerts: boolean
  }
  security: {
    sessionTimeoutHours: number
    twoFactorRequirement: "optional" | "admin_only" | "all_staff"
    maxLoginAttempts: number
    ipWhitelistingEnabled: boolean
  }
}
