"use client"

import { useMutation } from "@tanstack/react-query"
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
  const mutation = useMutation({
    mutationFn: () => startConversation(listingId),
    onSuccess: () => toast.success("Chat started with the seller."),
    onError: (err) => toast.error(describeError(err, "Couldn't start the chat. Please try again.")),
  })

  return {
    start: () => requireAuth(() => mutation.mutate()),
    isPending: mutation.isPending,
  }
}
