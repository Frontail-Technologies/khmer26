import { apiClient } from "@/lib/api/client"
import type { SellerType } from "@/features/sellers/api/sellers.api"

export type { SellerType } from "@/features/sellers/api/sellers.api"

export interface OwnSellerProfile {
  id: string
  userId: string
  shopName: string
  fullName: string | null
  username: string | null
  phone: string | null
  bio: string | null
  avatarMediaId: string | null
  avatarR2Key: string | null
  coverMediaId: string | null
  sellerType: SellerType
  provinceId: number | null
  districtId: number | null
  provinceName: string | null
  districtName: string | null
  createdAt: string
  updatedAt: string
}

export interface AccountProfile {
  user: {
    id: string
    email: string | null
    emailVerifiedAt: string | null
    createdAt: string
  }
  sellerProfile: OwnSellerProfile | null
}

export interface SaveProfileInput {
  shopName: string
  fullName: string
  username: string
  phone: string | null
  bio: string | null
  avatarMediaId: string | null
  sellerType: SellerType
  provinceId: number | null
  districtId: number | null
}

export interface VerificationState {
  status: "not_submitted" | "pending" | "in_review" | "approved" | "rejected"
  isVerified: boolean
  request: null | {
    id: string
    verificationType: SellerType
    legalName: string | null
    notes: string | null
    rejectionReason: string | null
    createdAt: string
    reviewedAt: string | null
    documents: Array<{ id: string; documentType: string | null; createdAt: string }>
  }
}

export async function getAccountProfile(): Promise<AccountProfile> {
  const [userResponse, sellerResponse] = await Promise.all([
    apiClient.get<{ user: AccountProfile["user"] }>("/users/me"),
    apiClient.get<{ profile: OwnSellerProfile | null }>("/sellers/me"),
  ])
  return { user: userResponse.data.user, sellerProfile: sellerResponse.data.profile }
}

export async function saveAccountProfile(profileId: string | null, input: SaveProfileInput) {
  const response = profileId
    ? await apiClient.patch<{ profile: OwnSellerProfile }>("/sellers/me", input)
    : await apiClient.post<{ profile: OwnSellerProfile }>("/sellers/me", input)
  return response.data.profile
}

export async function getMyVerification(): Promise<VerificationState> {
  const response = await apiClient.get<VerificationState>("/sellers/me/verification")
  return response.data
}

export async function submitVerification(input: {
  verificationType: SellerType
  legalName: string
  notes?: string
  mediaIds: string[]
}): Promise<void> {
  await apiClient.post("/sellers/me/verification", input)
}
