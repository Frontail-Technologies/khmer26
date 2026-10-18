import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "@/test/test-utils"
import en from "../../messages/en.json"
import km from "../../messages/km.json"
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, intlLocaleFor, isLocale } from "./config"
import { localizedName } from "@/lib/i18n/localized"
import { setLocaleCookie } from "@/lib/i18n/set-locale-cookie"
import { formatCompactPrice, formatCurrency, formatPriceWithCurrency } from "@/lib/formatters/currency"
import { formatDate } from "@/lib/formatters/date"

const refresh = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}))

import { LanguageSelector } from "@/components/layout/LanguageSelector"
import RootError from "@/app/error"

type Tree = { [key: string]: string | Tree }

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === "string") acc[path] = value
    else Object.assign(acc, flatten(value, path))
    return acc
  }, {})
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)(?=[,}])/g)].map((m) => m[1]!).sort()

describe("message catalogs", () => {
  const english = flatten(en as Tree)
  const khmer = flatten(km as Tree)

  it("have exactly the same keys in English and Khmer", () => {
    const missingInKhmer = Object.keys(english).filter((k) => !(k in khmer))
    const extraInKhmer = Object.keys(khmer).filter((k) => !(k in english))
    expect(missingInKhmer, `keys missing from km.json: ${missingInKhmer.join(", ")}`).toEqual([])
    expect(extraInKhmer, `keys only in km.json: ${extraInKhmer.join(", ")}`).toEqual([])
  })

  it("have no empty translations", () => {
    for (const [catalog, name] of [[english, "en"], [khmer, "km"]] as const) {
      const empty = Object.entries(catalog).filter(([, v]) => v.trim() === "").map(([k]) => k)
      expect(empty, `empty values in ${name}.json`).toEqual([])
    }
  })

  it("use the same {placeholders} in both languages", () => {
    for (const key of Object.keys(english)) {
      expect(placeholders(khmer[key] ?? ""), key).toEqual(placeholders(english[key]!))
    }
  })

  it("actually contain Khmer script in the Khmer catalog", () => {
    expect(khmer["errorPage.title"]).toMatch(/[ក-៿]/)
  })
})

describe("locale config", () => {
  it("supports English and Khmer with English as the default", () => {
    expect([...LOCALES]).toEqual(["en", "km"])
    expect(DEFAULT_LOCALE).toBe("en")
  })

  it("accepts only supported locales", () => {
    expect(isLocale("km")).toBe(true)
    for (const bad of ["fr", "", undefined, null, 5, "EN"]) expect(isLocale(bad)).toBe(false)
  })

  it("formats Khmer with Latin digits so prices and phone numbers stay unambiguous", () => {
    expect(intlLocaleFor("en")).toBe("en-US")
    const tag = intlLocaleFor("km")
    expect(new Intl.NumberFormat(tag).format(1234.5)).toMatch(/^[0-9,.]+$/)
  })
})

describe("localizedName", () => {
  const province = { nameEn: "Phnom Penh", nameKm: "ភ្នំពេញ" }

  it("returns Khmer in Khmer, English otherwise", () => {
    expect(localizedName(province, "km")).toBe("ភ្នំពេញ")
    expect(localizedName(province, "en")).toBe("Phnom Penh")
  })

  it("falls back to English when the Khmer name is missing or blank", () => {
    expect(localizedName({ nameEn: "Cars", nameKm: null }, "km")).toBe("Cars")
    expect(localizedName({ nameEn: "Cars", nameKm: "  " }, "km")).toBe("Cars")
    expect(localizedName({ nameEn: "Cars" }, "km")).toBe("Cars")
  })
})

describe("formatters accept a locale and keep their English defaults", () => {
  it("keeps existing output unchanged without a locale", () => {
    expect(formatCurrency(1500)).toBe("$1,500")
    expect(formatPriceWithCurrency(1500, "KHR")).toBe("1,500 KHR")
    expect(formatCompactPrice(1500)).toBe("1.5K")
    expect(formatDate("2026-03-15T00:00:00Z")).toMatch(/Mar 1[45], 2026/)
  })

  it("formats with the given locale", () => {
    const km = intlLocaleFor("km")
    expect(formatPriceWithCurrency(1500, "USD", km)).toBe("$1,500")
    expect(formatDate("2026-03-15T00:00:00Z", km)).not.toMatch(/Mar/)
  })
})

describe("setLocaleCookie", () => {
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`
  })

  it("stores the language in the cookie the server reads", () => {
    setLocaleCookie("km")
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=km`)
  })
})

describe("<LanguageSelector />", () => {
  beforeEach(() => refresh.mockReset())
  afterEach(() => {
    document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`
  })

  it("labels itself in the current language", () => {
    const { unmount } = renderWithProviders(<LanguageSelector />)
    expect(screen.getByRole("button", { name: "Change language" })).toBeInTheDocument()
    unmount()

    renderWithProviders(<LanguageSelector />, { locale: "km" })
    expect(screen.getByRole("button", { name: km.language.change })).toBeInTheDocument()
  })

  it("switches language: writes the cookie and refreshes the route (no URL change)", async () => {
    renderWithProviders(<LanguageSelector />)

    fireEvent.click(screen.getByRole("button", { name: "Change language" }))
    const khmer = await screen.findByRole("menuitem", { name: /ភាសាខ្មែរ/ })
    fireEvent.click(khmer)

    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1))
    expect(document.cookie).toContain(`${LOCALE_COOKIE}=km`)
  })

  it("does nothing when the current language is chosen again", async () => {
    renderWithProviders(<LanguageSelector />)
    fireEvent.click(screen.getByRole("button", { name: "Change language" }))
    fireEvent.click(await screen.findByRole("menuitem", { name: /English/ }))

    expect(refresh).not.toHaveBeenCalled()
    expect(document.cookie).not.toContain(`${LOCALE_COOKIE}=`)
  })
})

describe("global error page", () => {
  it("is translated and keeps the error reference", () => {
    const reset = vi.fn()
    const { unmount } = renderWithProviders(<RootError error={Object.assign(new Error("x"), { digest: "abc123" })} reset={reset} />)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText(/ref abc123/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalled()
    unmount()

    renderWithProviders(<RootError error={new Error("x")} reset={reset} />, { locale: "km" })
    expect(screen.getByText(km.errorPage.title)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: km.common.tryAgain })).toBeInTheDocument()
  })
})
