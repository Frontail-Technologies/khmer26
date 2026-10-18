import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import { ApiError } from "@/lib/api/client"
import { makeDetail } from "./detail-fixtures"
import { formatPhone } from "../lib/phone-format"

vi.mock("@/lib/media/get-media-url", () => ({
  getMediaUrl: (k: string | null | undefined) => (k ? `https://cdn.test/${k}` : null),
}))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/listing/x",
}))
vi.mock("@/features/auth/hooks/use-require-auth", () => ({
  useRequireAuth: () => <T,>(action: () => T) => action(),
}))
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const revealListingContacts = vi.fn()
const startConversation = vi.fn()
vi.mock("../api/listing-detail.api", async (orig) => ({
  ...(await orig<typeof import("../api/listing-detail.api")>()),
  revealListingContacts: (...a: unknown[]) => revealListingContacts(...a),
  startConversation: (...a: unknown[]) => startConversation(...a),
}))

import { ListingSellerCard } from "../components/detail/listing-seller-card"

const seller = (contacts: NonNullable<ReturnType<typeof makeDetail>["seller"]>["contacts"]) => ({
  ...makeDetail().seller!,
  contacts,
})

const TWO = [
  { id: "c1", type: "phone" as const, valueMasked: "086225xxx", carrier: "smart" as const },
  { id: "c2", type: "phone" as const, valueMasked: "0887883xxx", carrier: null },
]

beforeEach(() => {
  revealListingContacts.mockReset()
  startConversation.mockReset()
})

describe("phone formatting", () => {
  it("groups digits like the reference", () => {
    expect(formatPhone("086225333")).toBe("086 225 333")
    expect(formatPhone("0887883333")).toBe("088 788 3333")
    expect(formatPhone("123")).toBe("123")
  })
})

describe("<ListingSellerCard /> contact numbers", () => {
  it("shows masked numbers only, with the declared carrier and a neutral icon otherwise", () => {
    const { container } = renderWithProviders(<ListingSellerCard seller={seller(TWO)} listingId="l1" isOwner={false} />)
    expect(screen.getByText("086225xxx")).toBeInTheDocument()
    expect(screen.getByText("0887883xxx")).toBeInTheDocument()
    expect(screen.getByRole("img", { name: "Smart" })).toBeInTheDocument()
    expect(screen.queryByText("Smart")).toBeNull()
    expect(container.textContent).not.toMatch(/086225333|0887883333/)
    expect(screen.getByRole("button", { name: "Show Phone Number" })).toBeInTheDocument()
  })

  it("does not render a reveal button when the seller has no numbers", () => {
    renderWithProviders(<ListingSellerCard seller={seller([])} listingId="l1" isOwner={false} />)
    expect(screen.queryByRole("button", { name: "Show Phone Number" })).toBeNull()
  })

  it("calls the backend reveal for this listing and replaces every masked value", async () => {
    revealListingContacts.mockResolvedValue([
      { id: "c1", type: "phone", value: "086225333", carrier: "smart" },
      { id: "c2", type: "phone", value: "0887883333", carrier: null },
    ])
    renderWithProviders(<ListingSellerCard seller={seller(TWO)} listingId="l1" isOwner={false} />)

    fireEvent.click(screen.getByRole("button", { name: "Show Phone Number" }))

    expect(await screen.findByText("086 225 333")).toBeInTheDocument()
    expect(screen.getByText("088 788 3333")).toBeInTheDocument()
    expect(revealListingContacts).toHaveBeenCalledTimes(1)
    expect(revealListingContacts).toHaveBeenCalledWith("l1")
    expect(screen.queryByText("086225xxx")).toBeNull()
    expect(screen.queryByRole("button", { name: "Show Phone Number" })).toBeNull()
    expect(screen.getByRole("link", { name: "086 225 333" })).toHaveAttribute("href", "tel:086225333")
  })

  it("shows a loading state and ignores repeated clicks while the request is in flight", async () => {
    let resolve!: (v: unknown) => void
    revealListingContacts.mockReturnValue(new Promise((r) => (resolve = r)))
    renderWithProviders(<ListingSellerCard seller={seller(TWO)} listingId="l1" isOwner={false} />)

    fireEvent.click(screen.getByRole("button", { name: "Show Phone Number" }))
    const loading = await screen.findByRole("button", { name: "Loading…" })
    expect(loading).toBeDisabled()
    fireEvent.click(loading)
    expect(revealListingContacts).toHaveBeenCalledTimes(1)
    resolve([{ id: "c1", type: "phone", value: "086225333", carrier: "smart" }])
    await screen.findByText("086 225 333")
  })

  it("shows the rate-limit message and lets the visitor retry", async () => {
    revealListingContacts.mockRejectedValueOnce(
      new ApiError(429, { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." })
    )
    renderWithProviders(<ListingSellerCard seller={seller(TWO)} listingId="l1" isOwner={false} />)

    fireEvent.click(screen.getByRole("button", { name: "Show Phone Number" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many requests")
    expect(screen.getByText("086225xxx")).toBeInTheDocument()

    revealListingContacts.mockResolvedValueOnce([{ id: "c1", type: "phone", value: "086225333", carrier: "smart" }])
    fireEvent.click(screen.getByRole("button", { name: "Show Phone Number" }))
    expect(await screen.findByText("086 225 333")).toBeInTheDocument()
  })
})

describe("<ListingSellerCard /> structure", () => {
  it("has a profile URL row on the product host, one Chat button and a Follow control", async () => {
    startConversation.mockResolvedValue({ id: "conv-1" })
    renderWithProviders(<ListingSellerCard seller={seller(TWO)} listingId="l1" isOwner={false} />)

    const urlLinks = screen.getAllByRole("link").filter((a) => a.getAttribute("href") === "/seller/s1")
    expect(urlLinks.some((a) => a.textContent === "khmer26.com/seller/s1")).toBe(true)
    expect(document.body.textContent).not.toMatch(/localhost/)

    expect(screen.getAllByRole("button", { name: "Chat" })).toHaveLength(1)
    expect(screen.getByRole("button", { name: "Follow" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Chat" }))
    await waitFor(() => expect(startConversation).toHaveBeenCalledWith("l1"))
  })

  it("never renders a null profile URL or an epoch membership date from malformed data", () => {
    const malformed = { ...seller([]), id: null, joinedAt: null } as unknown as ReturnType<typeof seller>
    const { container } = renderWithProviders(
      <ListingSellerCard seller={malformed} listingId="l1" isOwner={false} />
    )

    expect(container.textContent).not.toContain("/seller/null")
    expect(container.textContent).not.toContain("Jan 1970")
  })
})
