export const SITE = {
  name: "Khmer26",
  tagline: "Cambodia's Modern Marketplace",
  description:
    "Buy and sell anything in Cambodia — vehicles, property, electronics, jobs, and more. Fast, simple, and trusted.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://khmer26.com",
  locale: "en",
  defaultCurrency: "USD" as const,
  supportedCurrencies: ["USD", "KHR"] as const,
} as const

export const SEO = {
  titleTemplate: "%s | Khmer26",
  defaultTitle: "Khmer26 — Cambodia's Modern Marketplace",
  defaultDescription: SITE.description,
} as const

export const LISTING_LIMITS = {
  free: 3,
  basic: 20,
  pro: 50,
  business: null,
} as const

export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  KHR: { symbol: "៛", name: "Cambodian Riel" },
} as const

export const LOCATIONS = [
  "All Cambodia",
  "Phnom Penh",
  "Siem Reap",
  "Sihanoukville",
  "Battambang",
  "Kampong Cham",
  "Kandal",
  "Takeo",
  "Kampot",
  "Kratie",
] as const
