import type { SellerProfile, SellerReview } from "../api/sellers.api"
import type { PublicListing } from "@/features/listings/api/listings.api"

export function makeSeller(overrides: Partial<SellerProfile> = {}): SellerProfile {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    shopName: "Angkor Motors",
    bio: "Family-run dealership in Phnom Penh.",
    sellerType: "dealer",
    avatarR2Key: "sellers/angkor.png",
    joinedAt: "2024-03-15T00:00:00.000Z",
    isVerified: true,
    listingCount: 2,
    isOwner: false,
    rating: { average: 4.5, count: 4, distribution: { 1: 0, 2: 0, 3: 1, 4: 1, 5: 2 } },
    ...overrides,
  }
}

export function makeReview(id: string, overrides: Partial<SellerReview> = {}): SellerReview {
  return {
    id,
    rating: 5,
    comment: `Great seller ${id}`,
    createdAt: "2026-05-01T00:00:00.000Z",
    reviewer: { name: "so***" },
    ...overrides,
  }
}

export function makeListing(id: string, title = `Listing ${id}`): PublicListing {
  return {
    id,
    title,
    description: null,
    price: "100.00",
    currency: "USD",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: { id: "c", nameEn: "Cars", nameKm: null, slug: "cars" },
    location: { province: { id: 1, nameEn: "Phnom Penh", nameKm: null }, district: null, commune: null },
    seller: null,
    primaryImage: null,
  }
}

export const pagination = (page: number, total: number, limit = 12) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
})
