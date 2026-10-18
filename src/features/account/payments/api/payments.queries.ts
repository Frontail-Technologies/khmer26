"use client"

import { useQuery } from "@tanstack/react-query"
import { customerKeys } from "@/lib/query/keys"
import { getAccountPayments } from "./payments.api"

export function useAccountPayments(page = 1, limit = 20) {
  return useQuery({
    queryKey: customerKeys.payments.list({ page, limit }),
    queryFn: () => getAccountPayments(page, limit),
    staleTime: 30_000,
  })
}
