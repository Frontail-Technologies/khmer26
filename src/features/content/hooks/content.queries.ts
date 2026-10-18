import { useQuery } from "@tanstack/react-query"
import { marketplaceKeys } from "@/lib/query/keys"
import { getPublicSafetyTips } from "../api/content.api"
import { getModerationKeywords } from "../api/content.api"
import type { PublicSafetyTip } from "../types"

export function usePublicSafetyTips(context: PublicSafetyTip["context"]) {
  return useQuery({
    queryKey: marketplaceKeys.content.safetyTips(context),
    queryFn: () => getPublicSafetyTips(context),
    staleTime: 5 * 60 * 1000,
  })
}

export function useModerationKeywords() {
  return useQuery({
    queryKey: marketplaceKeys.content.moderationKeywords(),
    queryFn: getModerationKeywords,
    staleTime: 5 * 60 * 1000,
  })
}
