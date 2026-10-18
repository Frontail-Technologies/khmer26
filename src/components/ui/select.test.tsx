import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "./select"

describe("Select", () => {
  it("renders the option label instead of its stored key", () => {
    render(
      <Select value="price_desc">
        <SelectTrigger aria-label="Sort listings">
          <SelectValue placeholder="Sort listings" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="price_desc">Price: high to low</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole("combobox", { name: "Sort listings" })).toHaveTextContent(
      "Price: high to low"
    )
    expect(screen.queryByText("price_desc")).not.toBeInTheDocument()
  })

  it("resolves dynamic ID values and does not expose unknown values", () => {
    render(
      <Select value="12">
        <SelectTrigger aria-label="Province">
          <SelectValue placeholder="Select province" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">Phnom Penh</SelectItem>
          <SelectItem value="13">Kandal</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole("combobox", { name: "Province" })).toHaveTextContent("Phnom Penh")
    expect(getSelectOptionLabel([], "internal-key", "Choose an option")).toBe("Choose an option")
  })
})
