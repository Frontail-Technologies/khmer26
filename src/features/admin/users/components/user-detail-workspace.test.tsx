import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import type { AdminUserDetail } from "../types"

const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}))
vi.mock("@/hooks/use-admin-auth", () => ({
  useAdminAuth: () => ({ user: { id: "admin-1" } }),
}))

const user: AdminUserDetail = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  phone: "-",
  role: "user",
  accountType: "buyer",
  location: "Phnom Penh",
  province: "Phnom Penh",
  listingsCount: 3,
  joinedAt: "Oct 17, 2026",
  verificationStatus: "unverified",
  status: "active",
  reportsCount: 2,
  activeListingsCount: 2,
  soldListingsCount: 1,
  accountHistory: [],
  recentListings: [],
  recentReviews: [],
  relatedReports: [],
}

vi.mock("../hooks/users.queries", () => ({
  useAdminUserDetail: () => ({ data: user, isLoading: false }),
}))
vi.mock("../hooks/users.mutations", () => ({
  useDeleteAdminUser: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateAdminUser: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateUserStatus: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useResetUserPassword: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock("./user-identity-card", () => ({ UserIdentityCard: () => <div>User identity</div> }))
vi.mock("./user-details-panel", () => ({ UserDetailsPanel: () => <div>Overview content</div> }))
vi.mock("./user-action-dialogs", () => ({ UserActionDialogs: () => null }))
vi.mock("./edit-user-sheet", () => ({ EditUserSheet: () => null }))
vi.mock("./user-record-tabs", () => ({
  UserListingsTab: () => <div>Listings content</div>,
  UserConversationsTab: () => <div>Conversations content</div>,
  UserReportsTab: () => <div>Reports content</div>,
  UserBillingTab: () => <div>Billing content</div>,
  UserActivityTab: () => <div>Activity content</div>,
}))

import { UserDetailWorkspace } from "./user-detail-workspace"

describe("UserDetailWorkspace tabs", () => {
  beforeEach(() => push.mockReset())

  it("exposes the user's operational records as line tabs", () => {
    renderWithProviders(<UserDetailWorkspace userId={user.id} />)

    for (const name of ["Overview", "Listings 3", "Conversations", "Reports 2", "Billing", "Activity", "Security"]) {
      expect(screen.getByRole("tab", { name })).toBeInTheDocument()
    }

    fireEvent.click(screen.getByRole("tab", { name: "Conversations" }))
    expect(screen.getByText("Conversations content")).toBeInTheDocument()
  })
})
