"use client"

import { X } from "@phosphor-icons/react"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { useCommunes, useDistricts, useProvinces } from "@/features/locations/api/locations.queries"
import { applyLocationChange, type SearchFilters } from "../lib/search-filters"

interface ActiveFilterChipsProps {
  filters: SearchFilters
  onChange: (next: SearchFilters) => void
  onClearAll: () => void
  definitions?: CategoryField[]
  /** Search page only: on a category page the category is the page itself, not a removable filter. */
  categoryChipLabel?: string
}

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

function fieldChipLabel(definition: CategoryField, value: string): string {
  const { field } = definition
  switch (field.fieldType) {
    case "select":
      return `${field.labelEn}: ${field.options.find((o) => o.value === value)?.labelEn ?? value}`
    case "boolean":
      return value === "true" ? field.labelEn : `${field.labelEn}: No`
    default:
      return `${field.labelEn}: ${value}`
  }
}

export function ActiveFilterChips({
  filters,
  onChange,
  onClearAll,
  definitions,
  categoryChipLabel,
}: ActiveFilterChipsProps) {
  const provinces = useProvinces()
  const districts = useDistricts(filters.provinceId)
  const communes = useCommunes(filters.districtId)

  const chips: Chip[] = []

  if (filters.q) {
    chips.push({
      key: "q",
      label: `Keyword: ${filters.q}`,
      onRemove: () => onChange({ ...filters, q: undefined }),
    })
  }

  if (categoryChipLabel && filters.category) {
    chips.push({
      key: "category",
      label: `Category: ${categoryChipLabel}`,
      onRemove: () => onChange({ ...filters, category: undefined, fields: {} }),
    })
  }

  if (filters.provinceId !== undefined) {
    chips.push({
      key: "province",
      label: provinces.data?.find((p) => p.id === filters.provinceId)?.nameEn ?? "Province",
      onRemove: () => onChange(applyLocationChange(filters, { provinceId: null })),
    })
  }
  if (filters.districtId !== undefined) {
    chips.push({
      key: "district",
      label: districts.data?.find((d) => d.id === filters.districtId)?.nameEn ?? "District",
      onRemove: () => onChange(applyLocationChange(filters, { districtId: null })),
    })
  }
  if (filters.communeId !== undefined) {
    chips.push({
      key: "commune",
      label: communes.data?.find((c) => c.id === filters.communeId)?.nameEn ?? "Commune",
      onRemove: () => onChange(applyLocationChange(filters, { communeId: null })),
    })
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice !== undefined ? filters.minPrice.toLocaleString() : "0"
    const max = filters.maxPrice !== undefined ? filters.maxPrice.toLocaleString() : "Any"
    chips.push({
      key: "price",
      label: `${min} – ${max}${filters.currency ? ` ${filters.currency}` : ""}`,
      onRemove: () =>
        onChange({ ...filters, minPrice: undefined, maxPrice: undefined, currency: undefined }),
    })
  } else if (filters.currency) {
    chips.push({
      key: "currency",
      label: filters.currency,
      onRemove: () => onChange({ ...filters, currency: undefined }),
    })
  }

  if (definitions) {
    for (const [name, value] of Object.entries(filters.fields)) {
      const definition = definitions.find((d) => d.field.name === name)
      if (!definition) continue
      chips.push({
        key: `field-${name}`,
        label: fieldChipLabel(definition, value),
        onRemove: () => {
          const fields = { ...filters.fields }
          delete fields[name]
          onChange({ ...filters, fields })
        },
      })
    }
  }

  if (chips.length === 0) return null

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
      {chips.map((chip) => (
        <span
          key={chip.key}
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
