"use client"

import { useQuery } from "@tanstack/react-query"
import { customerKeys } from "@/lib/query/keys"
import { getSubscriptionHistory, getSubscriptionPlans, getSubscriptionUsage } from "./subscription.api"

export function useSubscriptionPlans() {
  return useQuery({ queryKey: customerKeys.subscription.plans(), queryFn: getSubscriptionPlans, staleTime: 5 * 60_000 })
}

export function useSubscriptionUsage() {
  return useQuery({ queryKey: customerKeys.subscription.usage(), queryFn: getSubscriptionUsage, staleTime: 30_000 })
}

export function useSubscriptionHistory() {
  return useQuery({ queryKey: customerKeys.subscription.history(), queryFn: getSubscriptionHistory, staleTime: 30_000 })
}
