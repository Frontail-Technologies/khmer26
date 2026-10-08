"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CURRENCIES, type Currency } from "../lib/search-filters"
import { PILL_ACTIVE, PILL_BASE, PILL_IDLE } from "./filter-section"

interface PriceRangeFilterProps {
  minPrice?: number
  maxPrice?: number
  currency?: Currency
  onChange: (min?: number, max?: number, currency?: Currency) => void
}

type ParsedAmount = { ok: true; value: number | undefined } | { ok: false }

function parseAmount(raw: string): ParsedAmount {
  if (raw.trim() === "") return { ok: true, value: undefined }
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? { ok: true, value } : { ok: false }
}

/** Remount with a changing `key` to resync the draft with the URL. */
export function PriceRangeFilter({ minPrice, maxPrice, currency, onChange }: PriceRangeFilterProps) {
  const [min, setMin] = useState(minPrice !== undefined ? String(minPrice) : "")
  const [max, setMax] = useState(maxPrice !== undefined ? String(maxPrice) : "")
  const [draftCurrency, setDraftCurrency] = useState<Currency | undefined>(currency)
  const [error, setError] = useState<string | null>(null)

  const hasAppliedPrice = minPrice !== undefined || maxPrice !== undefined || currency !== undefined

  const apply = () => {
    const parsedMin = parseAmount(min)
    const parsedMax = parseAmount(max)
    if (!parsedMin.ok || !parsedMax.ok) {
      setError("Enter valid amounts.")
      return
    }
    if (
      parsedMin.value !== undefined &&
      parsedMax.value !== undefined &&
      parsedMin.value > parsedMax.value
    ) {
      setError("Minimum must not be higher than maximum.")
      return
    }
    setError(null)
    onChange(parsedMin.value, parsedMax.value, draftCurrency)
  }

  const clear = () => {
    setMin("")
    setMax("")
    setDraftCurrency(undefined)
    setError(null)
    onChange(undefined, undefined, undefined)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Currency">
        {CURRENCIES.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setDraftCurrency(draftCurrency === code ? undefined : code)}
            aria-pressed={draftCurrency === code}
            className={cn(PILL_BASE, draftCurrency === code ? PILL_ACTIVE : PILL_IDLE)}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="Min"
          aria-label="Minimum price"
          aria-invalid={error ? true : undefined}
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="text-muted-foreground text-xs">—</span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="Max"
          aria-label="Maximum price"
          aria-invalid={error ? true : undefined}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && (
        <p role="alert" className="text-[11px] font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={apply}
          className="flex-1 h-8 text-xs font-semibold cursor-pointer"
        >
          Apply
        </Button>
        {hasAppliedPrice && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clear}
            className="h-8 text-xs font-semibold cursor-pointer"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
