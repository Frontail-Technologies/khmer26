"use client"

import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ApiError } from "@/lib/api/client"
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth"
import { startConversation } from "../api/listing-detail.api"

export function describeError(err: unknown, fallback: string): string {
  return err instanceof ApiError && err.message ? err.message : fallback
}

/** Creates (or reuses) the real conversation with the seller. Requires a signed-in user. */
export function useStartConversation(listingId: string) {
  const requireAuth = useRequireAuth()
  const t = useTranslations("ui.listings")
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: () => startConversation(listingId),
    onSuccess: (conversation) => {
      toast.success(t("chatStarted"))
      router.push(`/messages/${conversation.id}`)
    },
    onError: (err) => toast.error(describeError(err, t("startChatFailed"))),
  })

  return {
    start: () => requireAuth(() => mutation.mutate()),
    isPending: mutation.isPending,
  }
}
