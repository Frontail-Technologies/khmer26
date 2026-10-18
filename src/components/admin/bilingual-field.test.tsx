import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it } from "vitest"
import { BilingualField } from "./bilingual-field"

function Harness({ multiline = false }: { multiline?: boolean }) {
  const [en, setEn] = useState("")
  const [km, setKm] = useState("")
  return (
    <>
      <BilingualField id="tip" label="Guideline" required multiline={multiline} valueEn={en} valueKm={km} onChangeEn={setEn} onChangeKm={setKm} />
      <output data-testid="state">{JSON.stringify({ en, km })}</output>
    </>
  )
}

describe("<BilingualField />", () => {
  it("labels and edits English and Khmer independently", () => {
    render(<Harness />)

    fireEvent.change(screen.getByLabelText(/Guideline · English/), { target: { value: "Meet in public" } })
    fireEvent.change(screen.getByLabelText(/Guideline · ខ្មែរ/), { target: { value: "ជួបនៅទីសាធារណៈ" } })

    expect(JSON.parse(screen.getByTestId("state").textContent!)).toEqual({ en: "Meet in public", km: "ជួបនៅទីសាធារណៈ" })
  })

  it("marks only the English field as required and tags each with its language", () => {
    render(<Harness />)

    expect(screen.getByLabelText(/Guideline · English/)).toHaveAttribute("lang", "en")
    expect(screen.getByLabelText(/Guideline · ខ្មែរ/)).toHaveAttribute("lang", "km")
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("renders text areas when multiline", () => {
    render(<Harness multiline />)

    expect(screen.getByLabelText(/Guideline · English/).tagName).toBe("TEXTAREA")
    expect(screen.getByLabelText(/Guideline · ខ្មែរ/).tagName).toBe("TEXTAREA")
  })
})
