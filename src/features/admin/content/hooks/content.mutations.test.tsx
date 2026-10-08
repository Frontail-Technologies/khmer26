import { describe, expect, it, vi } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { adminKeys, marketplaceKeys } from "@/lib/query/keys"

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock("../api/content.api", async (orig) => ({
  ...(await orig<typeof import("../api/content.api")>()),
  createAdminBanner: vi.fn().mockResolvedValue({}),
  updateAdminBanner: vi.fn().mockResolvedValue({}),
  activateAdminBanner: vi.fn().mockResolvedValue({}),
  deactivateAdminBanner: vi.fn().mockResolvedValue({}),
  deleteAdminBanner: vi.fn().mockResolvedValue({}),
}))

import {
  useCreateBanner,
  useUpdateBanner,
  useToggleBannerActive,
  useDeleteBanner,
} from "./content.mutations"

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const spy = vi.spyOn(queryClient, "invalidateQueries")
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { spy, wrapper }
}

function invalidatedKeys(spy: ReturnType<typeof setup>["spy"]) {
  return spy.mock.calls.map((c) => c[0]?.queryKey)
}

describe("admin banner mutations invalidate the real homepage query", () => {
  const cases: Array<[string, () => unknown, unknown]> = [
    ["create", useCreateBanner, { title: "t", placement: "homepage" }],
    ["update", useUpdateBanner, { id: "1", data: {} }],
    ["activate/deactivate", useToggleBannerActive, { id: "1", isActive: false }],
    ["delete", useDeleteBanner, "1"],
  ]

  it.each(cases)("%s", async (_name, useHook, variables) => {
    const { spy, wrapper } = setup()
    const { result } = renderHook(() => useHook() as { mutate: (v: unknown) => void }, { wrapper })

    act(() => result.current.mutate(variables))

    await waitFor(() => expect(invalidatedKeys(spy)).toContainEqual(marketplaceKeys.home()))
    expect(invalidatedKeys(spy)).toContainEqual(adminKeys.content.banners())
    expect(invalidatedKeys(spy)).not.toContainEqual(["public-banners"])
    expect(invalidatedKeys(spy)).not.toContainEqual(undefined)
  })
})
