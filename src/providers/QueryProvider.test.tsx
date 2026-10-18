import { render, screen, waitFor } from "@testing-library/react"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { describe, expect, it, vi } from "vitest"
import { authKeys } from "@/lib/query/keys"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { QueryProvider } from "./QueryProvider"

const getMe = vi.fn()
vi.mock("@/features/auth/api/auth.api", async (original) => ({
  ...(await original<typeof import("@/features/auth/api/auth.api")>()),
  getMe: () => getMe(),
}))

function AuthenticationState() {
  const { user, isLoading } = useCurrentUser()
  return <div>{isLoading ? "Loading" : user?.email ?? "Guest"}</div>
}

describe("QueryProvider authentication hydration", () => {
  it("renders the prefetched user immediately without another request", async () => {
    const serverClient = new QueryClient()
    serverClient.setQueryData(authKeys.session(), {
      id: "user-1",
      email: "seller@example.com",
      role: "user",
      status: "active",
      emailVerifiedAt: null,
      createdAt: "2026-10-16T00:00:00.000Z",
    })

    render(
      <QueryProvider dehydratedState={dehydrate(serverClient)}>
        <AuthenticationState />
      </QueryProvider>
    )

    expect(screen.getByText("seller@example.com")).toBeInTheDocument()
    await waitFor(() => expect(getMe).not.toHaveBeenCalled())
  })
})
