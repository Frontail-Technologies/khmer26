import { apiClient } from "@/lib/api/client"

export interface PrivacyPreferences {
  showPhoneNumber: boolean
  allowBuyersFollow: boolean
  showActiveStatus: boolean
  showSellerRating: boolean
}

export interface AccountSession {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  lastUsedAt: string
  expiresAt: string
  isCurrent: boolean
}

export interface AuthenticationMethods {
  hasPassword: boolean
  providers: Array<{
    id: string
    provider: "google" | "telegram"
    linkedAt: string
    lastUsedAt: string | null
  }>
}

export async function getPrivacyPreferences(): Promise<PrivacyPreferences> {
  const response = await apiClient.get<{ preferences: PrivacyPreferences }>("/users/me/privacy")
  return response.data.preferences
}

export async function updatePrivacyPreferences(changes: Partial<PrivacyPreferences>): Promise<PrivacyPreferences> {
  const response = await apiClient.patch<{ preferences: PrivacyPreferences }>("/users/me/privacy", changes)
  return response.data.preferences
}

export async function getAccountSessions(): Promise<AccountSession[]> {
  const response = await apiClient.get<{ sessions: AccountSession[] }>("/auth/sessions")
  return response.data.sessions
}

export async function revokeAccountSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/auth/sessions/${encodeURIComponent(sessionId)}`)
}

export async function logoutOtherSessions(): Promise<void> {
  await apiClient.delete("/auth/sessions")
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post("/auth/password/change", { currentPassword, newPassword })
}

export async function getAuthenticationMethods(): Promise<AuthenticationMethods> {
  const response = await apiClient.get<AuthenticationMethods>("/auth/providers")
  return response.data
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete("/users/me")
}
