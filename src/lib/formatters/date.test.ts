import { describe, expect, it } from "vitest"
import { formatAdminDate, formatAdminDateTime } from "./date"

describe("admin date formatting", () => {
  const local = new Date(2020, 5, 22, 15, 45)

  it("writes the day, full month and year", () => {
    expect(formatAdminDate(local)).toBe("22 June 2020")
  })

  it("adds the time of day after the date", () => {
    expect(formatAdminDateTime(local)).toBe("22 June 2020, 3:45 PM")
    expect(formatAdminDateTime(new Date(2020, 5, 2, 0, 5))).toBe("2 June 2020, 12:05 AM")
  })

  it("accepts ISO strings", () => {
    expect(formatAdminDateTime(local.toISOString())).toBe("22 June 2020, 3:45 PM")
  })

  it("shows a dash for missing or invalid values", () => {
    expect(formatAdminDate(null)).toBe("—")
    expect(formatAdminDateTime(undefined)).toBe("—")
    expect(formatAdminDateTime("not a date")).toBe("—")
  })
})
