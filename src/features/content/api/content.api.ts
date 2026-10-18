import { apiClient } from "@/lib/api/client"
import type { ModerationKeyword, PublicSafetyTip } from "../types"

export async function getPublicSafetyTips(context: PublicSafetyTip["context"]): Promise<PublicSafetyTip[]> {
  const response = await apiClient.get<{ tips: PublicSafetyTip[] }>("/content/safety-tips", {
    params: { context },
  })
  return response.data?.tips ?? []
}

export async function getModerationKeywords(): Promise<ModerationKeyword[]> {
  const response = await apiClient.get<{ keywords: ModerationKeyword[] }>("/content/moderation-keywords")
  return response.data?.keywords ?? []
}
