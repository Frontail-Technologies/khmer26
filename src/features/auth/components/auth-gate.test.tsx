import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { AuthGate } from "./auth-gate"

const replace = vi.fn()
let session = { isAuthenticated: false, isLoading: true }

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/account/listings",
  useSearchParams: () => new URLSearchParams("status=sold"),
}))
vi.mock("../hooks/use-current-user", () => ({ useCurrentUser: () => session }))
vi.mock("@/components/shared/LoadingState", () => ({ LoadingState: () => <div>loading</div> }))
vi.mock("@/components/layout/Container", () => ({ Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }))

describe("<AuthGate />", () => {
  beforeEach(() => replace.mockClear())

  it("shows a placeholder, not the page, while the session is being checked", () => {
    session = { isAuthenticated: false, isLoading: true }
    render(<AuthGate><p>secret page</p></AuthGate>)

    expect(screen.queryByText("secret page")).not.toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })

  it("sends an expired session to sign-in and keeps the page and its filters to return to", async () => {
    session = { isAuthenticated: false, isLoading: false }
    render(<AuthGate><p>secret page</p></AuthGate>)

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login?next=%2Faccount%2Flistings%3Fstatus%3Dsold"))
    expect(screen.queryByText("secret page")).not.toBeInTheDocument()
  })

  it("shows the page for a valid session", () => {
    session = { isAuthenticated: true, isLoading: false }
    render(<AuthGate><p>secret page</p></AuthGate>)

    expect(screen.getByText("secret page")).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })
})
