"use client"

import type { FilterState } from "@/features/search/types"
import { X } from "@phosphor-icons/react"

interface ActiveFilterChipsProps {
  filters: FilterState
  onRemoveFilter: (key: keyof FilterState, value?: string) => void
  onClearAll: () => void
}

export function ActiveFilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  const chips: Array<{ label: string; onRemove: () => void }> = []

  if (filters.category) {
    chips.push({
      label: `Category: ${filters.category}`,
      onRemove: () => onRemoveFilter("category"),
    })
  }

  if (filters.location) {
    chips.push({
      label: filters.location,
      onRemove: () => onRemoveFilter("location"),
    })
  }

  filters.brands.forEach((b) => {
    chips.push({
      label: b,
      onRemove: () => onRemoveFilter("brands", b),
    })
  })

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice !== undefined ? `$${filters.minPrice.toLocaleString()}` : "$0"
    const max = filters.maxPrice !== undefined ? `$${filters.maxPrice.toLocaleString()}` : "Any"
    chips.push({
      label: `${min} – ${max}`,
      onRemove: () => {
        onRemoveFilter("minPrice")
        onRemoveFilter("maxPrice")
      },
    })
  }

  if (filters.yearFrom !== undefined || filters.yearTo !== undefined) {
    const from = filters.yearFrom ?? "Any"
    const to = filters.yearTo ?? "Present"
    chips.push({
      label: `Year: ${from}–${to}`,
      onRemove: () => {
        onRemoveFilter("yearFrom")
        onRemoveFilter("yearTo")
      },
    })
  }

  filters.conditions.forEach((c) => {
    chips.push({
      label: c.replace("_", " "),
      onRemove: () => onRemoveFilter("conditions", c),
    })
  })

  filters.fuels.forEach((f) => {
    chips.push({
      label: f,
      onRemove: () => onRemoveFilter("fuels", f),
    })
  })

  filters.transmissions.forEach((t) => {
    chips.push({
      label: t,
      onRemove: () => onRemoveFilter("transmissions", t),
    })
  })

  filters.sellerTypes.forEach((s) => {
    chips.push({
      label: s === "dealer" ? "Dealer" : "Individual",
      onRemove: () => onRemoveFilter("sellerTypes", s),
    })
  })

  if (filters.verifiedOnly) {
    chips.push({
      label: "Verified Only",
      onRemove: () => onRemoveFilter("verifiedOnly"),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
      {chips.map((chip, index) => (
        <span
          key={`${chip.label}-${index}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-2xs transition-colors hover:bg-primary/15"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="rounded-full p-0.5 text-primary/70 transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={11} weight="bold" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="shrink-0 text-xs font-bold text-primary hover:text-primary/80 transition-colors ml-1 px-1.5 py-0.5"
      >
        Clear all
      </button>
    </div>
  )
}
