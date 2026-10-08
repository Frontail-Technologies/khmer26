import type { HomeBanner, HomeListing, HomeResponse } from "../api/home.api"

export function makeBanner(overrides: Partial<HomeBanner> = {}): HomeBanner {
  return {
    id: "b1",
    title: "Real banner",
    placement: "homepage",
    imageR2Key: "banners/real.jpg",
    mobileImageR2Key: null,
    destinationType: "category",
    destinationValue: "vehicles",
    destinationLabel: "Shop vehicles",
    sortOrder: 1,
    ...overrides,
  }
}

export function makeListing(overrides: Partial<HomeListing> = {}): HomeListing {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Backend Honda Dream",
    description: null,
    price: "1250.00",
    currency: "USD",
    status: "active",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "c1", nameEn: "Motorcycles", nameKm: null, slug: "motorcycles" },
    location: {
      province: { id: 12, nameEn: "Phnom Penh", nameKm: null },
      district: { id: 1201, nameEn: "Chamkar Mon", nameKm: null },
      commune: null,
    },
    seller: null,
    primaryImage: { mediaId: "m2", r2Key: "listings/dream.jpg", mimeType: "image/jpeg", sizeBytes: 100 },
    ...overrides,
  }
}

export function makeHome(overrides: Partial<HomeResponse> = {}): HomeResponse {
  return {
    sections: [],
    banners: [],
    featuredSections: [],
    popularCategories: [],
    safetyTips: [],
    newListings: [],
    ...overrides,
  }
}
