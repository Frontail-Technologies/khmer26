"use client"

import { useTranslations } from "next-intl"
import type { ReactNode } from "react"
import { CaretDown, CurrencyDollar, MapPin, Sliders, Tag } from "@phosphor-icons/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { CategoryField } from "@/features/categories/api/categories.api"
import { useLocalizedLabel } from "@/lib/i18n/localized"
import type { SearchFilters } from "../lib/search-filters"
import {
  CategorySection,
  DynamicFieldFilter,
  LocationSection,
  type CategoryNavData,
} from "./filter-panel"
import { PriceRangeFilter } from "./price-range-filter"

interface FilterBarProps {
  filters: SearchFilters
  onChange: (next: SearchFilters) => void
  definitions?: CategoryField[]
  fieldsLoading?: boolean
  categoryNav?: CategoryNavData | null
}

function BarButton({
  icon,
  label,
  active,
  children,
  width = "w-72",
}: {
  icon: ReactNode
  label: string
  active: boolean
  children: ReactNode
  width?: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border bg-muted/60 text-foreground hover:bg-muted"
        )}
      >
        {icon}
        <span>{label}</span>
        <CaretDown size={11} weight="bold" className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className={width}>{children}</PopoverContent>
    </Popover>
  )
}

/** Desktop filter controls: one popover per filter group, replacing the old side panel. */
export function FilterBar({ filters, onChange, definitions, fieldsLoading, categoryNav }: FilterBarProps) {
  const t = useTranslations("ui.filterBar")
  const getLocalizedLabel = useLocalizedLabel()

  const setField = (name: string, value: string | undefined) => {
    const fields = { ...filters.fields }
    if (value === undefined) delete fields[name]
    else fields[name] = value
    onChange({ ...filters, fields })
  }

  const hasLocation = filters.provinceId !== undefined
  const hasPrice =
    filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.currency !== undefined
  const fieldCount = Object.keys(filters.fields).length

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categoryNav && (
        <BarButton icon={<Tag size={14} className="text-primary" />} label={t("category")} active={Boolean(filters.category)} width="w-80">
          <CategorySection bare nav={categoryNav} selected={filters.category} />
        </BarButton>
      )}

      <BarButton icon={<MapPin size={14} className="text-primary" />} label={t("location")} active={hasLocation}>
        <LocationSection bare filters={filters} onChange={onChange} />
      </BarButton>

      <BarButton icon={<CurrencyDollar size={14} className="text-primary" />} label={t("price")} active={hasPrice}>
        <PriceRangeFilter
          key={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}-${filters.currency ?? ""}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          currency={filters.currency}
          onChange={(minPrice, maxPrice, currency) => onChange({ ...filters, minPrice, maxPrice, currency })}
        />
      </BarButton>

      {(fieldsLoading || (definitions?.length ?? 0) > 0) && (
        <BarButton
          icon={<Sliders size={14} className="text-primary" />}
          label={fieldCount > 0 ? `${t("moreFilters")} · ${fieldCount}` : t("moreFilters")}
          active={fieldCount > 0}
          width="w-80"
        >
          <div className="space-y-4">
            {definitions?.map((definition) => (
              <div key={definition.field.id} className="space-y-1.5">
                <p className="text-xs font-bold text-foreground">{getLocalizedLabel(definition.field)}</p>
                <DynamicFieldFilter
                  definition={definition}
                  value={filters.fields[definition.field.name]}
                  onChange={(value) => setField(definition.field.name, value)}
                />
              </div>
            ))}
          </div>
        </BarButton>
      )}
    </div>
  )
}
