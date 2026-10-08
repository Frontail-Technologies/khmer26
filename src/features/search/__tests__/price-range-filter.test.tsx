import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { PriceRangeFilter } from "../components/price-range-filter"

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe("<PriceRangeFilter />", () => {
  it("applies min, max and currency in a single change", () => {
    const onChange = vi.fn()
    render(<PriceRangeFilter onChange={onChange} />)

    type("Minimum price", "100")
    type("Maximum price", "500")
    fireEvent.click(screen.getByRole("button", { name: "KHR" }))
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(100, 500, "KHR")
  })

  it("ignores empty fields cleanly instead of sending NaN or zero", () => {
    const onChange = vi.fn()
    render(<PriceRangeFilter onChange={onChange} />)

    type("Minimum price", "250")
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(onChange).toHaveBeenCalledWith(250, undefined, undefined)
  })

  it("refuses a minimum higher than the maximum and explains why", () => {
    const onChange = vi.fn()
    render(<PriceRangeFilter onChange={onChange} />)

    type("Minimum price", "900")
    type("Maximum price", "100")
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole("alert")).toHaveTextContent(/minimum/i)
  })

  it("preserves the currently selected currency", () => {
    const onChange = vi.fn()
    render(<PriceRangeFilter minPrice={10} currency="USD" onChange={onChange} />)

    type("Maximum price", "20")
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(onChange).toHaveBeenCalledWith(10, 20, "USD")
  })

  it("Clear removes both prices and the currency", () => {
    const onChange = vi.fn()
    render(<PriceRangeFilter minPrice={10} maxPrice={20} currency="USD" onChange={onChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Clear" }))
    expect(onChange).toHaveBeenCalledWith(undefined, undefined, undefined)
    expect(screen.getByLabelText("Minimum price")).toHaveValue(null)
  })

  it("does not show Clear when no price is applied", () => {
    render(<PriceRangeFilter onChange={vi.fn()} />)
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull()
  })
})
