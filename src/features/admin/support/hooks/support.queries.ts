import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { adminKeys } from "@/lib/query/keys"
import { getSupportSubmissions, updateSupportSubmission, type SupportQuery } from "../api/support.api"
import type { SupportStatus } from "../types"

export function useSupportSubmissions(params: SupportQuery) {
  return useQuery({
    queryKey: adminKeys.support.list(params),
    queryFn: () => getSupportSubmissions(params),
  })
}

export function useUpdateSupportSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status?: SupportStatus; adminNote?: string | null }) =>
      updateSupportSubmission(id, { status, adminNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.support.all })
      toast.success("Support request updated")
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update support request"),
  })
}
