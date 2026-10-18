"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { CaretDown, Check, CurrencyDollar, MapPin, Sliders, Tag } from "@phosphor-icons/react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { CategoryField, CategoryNode } from "@/features/categories/api/categories.api"
import { useCommunes, useDistricts, useProvinces } from "@/features/locations/api/locations.queries"
import type { LocationOption } from "@/features/locations/api/locations.api"
import {
  applyLocationChange,
  type SearchFilters,
} from "../lib/search-filters"
import {
  FilterSection,
  OPTION_BUTTON_ACTIVE,
  OPTION_BUTTON_BASE,
  OPTION_BUTTON_IDLE,
  PILL_ACTIVE,
  PILL_BASE,
  PILL_IDLE,
} from "./filter-section"
import { CategoryTreeNav } from "./category-tree-nav"
import { PriceRangeFilter } from "./price-range-filter"
import { useLocalizedLabel, useLocalizedName } from "@/lib/i18n/localized"

export interface CategoryNavData {
  roots: CategoryNode[]
  /** Ids from the root down to the selected category, inclusive. */
  ancestorIds: string[]
  onSelect: (slug: string | null) => void
}

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (next: SearchFilters) => void
  definitions?: CategoryField[]
  fieldsLoading?: boolean
  categoryNav?: CategoryNavData | null
}

function OptionButton({
  selected,
  onClick,
  children,
  indent = 0,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  indent?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={indent ? { paddingLeft: `${0.625 + indent * 0.75}rem` } : undefined}
      className={cn(OPTION_BUTTON_BASE, selected ? OPTION_BUTTON_ACTIVE : OPTION_BUTTON_IDLE)}
    >
      <span className="truncate">{children}</span>
      {selected && <Check size={12} weight="bold" className="shrink-0" />}
    </button>
  )
}

export function CategorySection({ nav, selected, bare }: { nav: CategoryNavData; selected?: string; bare?: boolean }) {
  const tGenerated = useTranslations("generated")
  return (
    <FilterSection bare={bare} title={tGenerated("category")} icon={<Tag size={14} className="text-primary" />}>
      <div>
        <CategoryTreeNav
          roots={nav.roots}
          selectedSlug={selected}
          ancestorIds={nav.ancestorIds}
          onSelect={nav.onSelect}
        />
      </div>
    </FilterSection>
  )
}

function LocationList({
  label,
  allLabel,
  options,
  selectedId,
  isLoading,
  isError,
  onSelect,
}: {
  label: string
  allLabel: string
  options: LocationOption[] | undefined
  selectedId: number | undefined
  isLoading: boolean
  isError: boolean
  onSelect: (id: number | null) => void
}) {
  const tDynamic = useTranslations("dynamic")
  const getLocalizedName = useLocalizedName()
  if (isLoading) return <p className="px-1 py-1 text-xs text-muted-foreground">{tDynamic("loadingNamed", { name: label })}</p>
  if (isError) return <p className="px-1 py-1 text-xs text-destructive">{tDynamic("couldNotLoadNamed", { name: label })}</p>

  return (
    <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
      <OptionButton selected={selectedId === undefined} onClick={() => onSelect(null)}>
        {allLabel}
      </OptionButton>
      {(options ?? []).map((option) => (
        <OptionButton
          key={option.id}
          selected={selectedId === option.id}
          onClick={() => onSelect(option.id)}
        >
          {getLocalizedName(option)}
        </OptionButton>
      ))}
    </div>
  )
}

export function LocationSection({ filters, onChange, bare }: Pick<FilterPanelProps, "filters" | "onChange"> & { bare?: boolean }) {
  const tGenerated = useTranslations("generated")
  const getLocalizedName = useLocalizedName()
  const provinces = useProvinces()
  const districts = useDistricts(filters.provinceId)
  const communes = useCommunes(filters.districtId)
  const [showAllProvinces, setShowAllProvinces] = useState(false)

  const selectedProvince = provinces.data?.find((p) => p.id === filters.provinceId)
  // With a province chosen, the long province list collapses to that province plus its districts.
  const collapseProvinces = filters.provinceId !== undefined && !showAllProvinces

  return (
    <FilterSection bare={bare} title={tGenerated("location")} icon={<MapPin size={14} className="text-primary" />}>
      <div className="space-y-2">
        {collapseProvinces ? (
          <div className="space-y-1">
            <OptionButton
              selected={true}
              onClick={() => onChange(applyLocationChange(filters, { provinceId: null }))}
            >
              {selectedProvince ? getLocalizedName(selectedProvince) : tGenerated("selectedProvince")}
            </OptionButton>
            <button
              type="button"
              onClick={() => setShowAllProvinces(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xxs font-semibold text-primary hover:underline"
            >
              <CaretDown size={10} weight="bold" />
              <LocalizedText id="otherProvinces" />
            </button>
          </div>
        ) : (
          <LocationList
            label={tGenerated("provinces")}
            allLabel={tGenerated("allLocations")}
            options={provinces.data}
            selectedId={filters.provinceId}
            isLoading={provinces.isLoading}
            isError={provinces.isError}
            onSelect={(id) => {
              setShowAllProvinces(false)
              onChange(applyLocationChange(filters, { provinceId: id }))
            }}
          />
        )}

        {filters.provinceId !== undefined && (
          <div className="space-y-1 border-l-2 border-border/60 pl-2">
            <span className="px-1 text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              <LocalizedText id="district" />
            </span>
            <LocationList
              label={tGenerated("districts")}
              allLabel={tGenerated("allDistricts")}
              options={districts.data}
              selectedId={filters.districtId}
              isLoading={districts.isLoading}
              isError={districts.isError}
              onSelect={(id) => onChange(applyLocationChange(filters, { districtId: id }))}
            />
          </div>
        )}

        {filters.districtId !== undefined && (
          <div className="space-y-1 border-l-2 border-border/60 pl-2 ml-2">
            <span className="px-1 text-2xs font-bold uppercase tracking-wider text-muted-foreground">
              <LocalizedText id="commune" />
            </span>
            <LocationList
              label={tGenerated("communes")}
              allLabel={tGenerated("allCommunes")}
              options={communes.data}
              selectedId={filters.communeId}
              isLoading={communes.isLoading}
              isError={communes.isError}
              onSelect={(id) => onChange(applyLocationChange(filters, { communeId: id }))}
            />
          </div>
        )}
      </div>
    </FilterSection>
  )
}

/** Remount with a changing `key` to resync the draft with the URL. */
function CommittedInput({
  value,
  type,
  placeholder,
  label,
  onCommit,
}: {
  value: string
  type: "text" | "number"
  placeholder: string
  label: string
  onCommit: (value: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const commit = () => {
    if (draft.trim() !== value) onCommit(draft.trim())
  }

  return (
    <input
      type={type}
      inputMode={type === "number" ? "decimal" : undefined}
      value={draft}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      className="h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
    />
  )
}

export function DynamicFieldFilter({
  definition,
  value,
  onChange,
}: {
  definition: CategoryField
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  const { field } = definition
  const tDynamic = useTranslations("dynamic")
  const getLocalizedLabel = useLocalizedLabel()
  const fieldLabel = getLocalizedLabel(field)

  switch (field.fieldType) {
    case "select":
      return (
        <div className="flex flex-wrap gap-1.5">
          {field.options.map((option) => {
            const selected = value === option.value
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(selected ? undefined : option.value)}
                className={cn(PILL_BASE, selected ? PILL_ACTIVE : PILL_IDLE)}
              >
                {getLocalizedLabel(option)}
              </button>
            )
          })}
        </div>
      )
    case "boolean":
      return (
        <label className="flex items-center gap-2 p-1 cursor-pointer select-none text-xs font-medium text-foreground">
          <Checkbox
            checked={value === "true"}
            onCheckedChange={(checked) => onChange(checked ? "true" : undefined)}
          />
          <span><LocalizedText id="yes" /></span>
        </label>
      )
    case "number":
      return (
        <CommittedInput
          key={value ?? ""}
          type="number"
          value={value ?? ""}
          placeholder={tDynamic("enterNamed", { name: fieldLabel.toLocaleLowerCase() })}
          label={fieldLabel}
          onCommit={(next) => onChange(next || undefined)}
        />
      )
    case "text":
    default:
      return (
        <CommittedInput
          key={value ?? ""}
          type="text"
          value={value ?? ""}
          placeholder={tDynamic("searchNamed", { name: fieldLabel.toLocaleLowerCase() })}
          label={fieldLabel}
          onCommit={(next) => onChange(next || undefined)}
        />
      )
  }
}

export function FilterPanel({
  filters,
  onChange,
  definitions,
  fieldsLoading,
  categoryNav,
}: FilterPanelProps) {
  const tGenerated = useTranslations("generated")
  const getLocalizedLabel = useLocalizedLabel()
  const setField = (name: string, value: string | undefined) => {
    const fields = { ...filters.fields }
    if (value === undefined) delete fields[name]
    else fields[name] = value
    onChange({ ...filters, fields })
  }

  return (
    <div className="space-y-3 text-xs">
      {categoryNav && <CategorySection nav={categoryNav} selected={filters.category} />}

      <LocationSection filters={filters} onChange={onChange} />

      <FilterSection title={tGenerated("budget")} icon={<CurrencyDollar size={14} className="text-primary" />}>
        <PriceRangeFilter
          key={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}-${filters.currency ?? ""}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          currency={filters.currency}
          onChange={(minPrice, maxPrice, currency) =>
            onChange({ ...filters, minPrice, maxPrice, currency })
          }
        />
      </FilterSection>

      {filters.category && fieldsLoading && (
        <p className="px-1 text-xs text-muted-foreground"><LocalizedText id="loadingCategoryFilters" /></p>
      )}

      {definitions?.map((definition) => (
        <FilterSection
          key={definition.field.id}
          title={getLocalizedLabel(definition.field)}
          icon={<Sliders size={14} className="text-primary" />}
        >
          <DynamicFieldFilter
            definition={definition}
            value={filters.fields[definition.field.name]}
            onChange={(value) => setField(definition.field.name, value)}
          />
        </FilterSection>
      ))}
    </div>
  )
}
