"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCommunes, useDistricts, useProvinces } from "@/features/locations/api/locations.queries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ListingDraft } from "../../types"
import { LinkSimple } from "@phosphor-icons/react"
import { useLocalizedName } from "@/lib/i18n/localized"

interface PriceLocationStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
}

export function PriceLocationStep({
  draft,
  onChange,
  errors = {},
}: PriceLocationStepProps) {
  const tGenerated = useTranslations("generated")
  const getLocalizedName = useLocalizedName()
  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces()
  const { data: districts = [], isLoading: isLoadingDistricts } = useDistricts(draft.location.provinceId)
  const { data: communes = [], isLoading: isLoadingCommunes } = useCommunes(draft.location.districtId)

  const handlePriceChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, "")
    onChange({ price: numeric === "" ? "" : Number(numeric) })
  }

  const handleProvinceChange = (value: string) => {
    const provinceId = Number(value)
    const selected = provinces.find((item) => item.id === provinceId)
    const province = selected ? getLocalizedName(selected) : ""
    onChange({
      location: {
        ...draft.location,
        provinceId,
        districtId: undefined,
        communeId: undefined,
        province,
        district: "",
        label: province,
      },
    })
  }

  const handleDistrictChange = (value: string) => {
    const districtId = Number(value)
    const selected = districts.find((item) => item.id === districtId)
    const district = selected ? getLocalizedName(selected) : ""
    const province = draft.location.province
    const label = district ? `${district}, ${province}` : province
    onChange({
      location: {
        ...draft.location,
        districtId,
        communeId: undefined,
        province,
        district,
        label,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="price-amount" className="block text-xs font-bold text-foreground">
          <LocalizedText id="priceUsd" /> <span className="text-destructive">*</span>
        </label>

        <InputGroup className="h-11 sm:h-12 rounded-xl">
          <InputGroupAddon align="inline-start" className="text-sm font-black text-primary px-3.5">
            $
          </InputGroupAddon>
          <InputGroupInput
            id="price-amount"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={draft.price === "" ? "" : draft.price.toString()}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="text-base sm:text-lg font-bold text-foreground"
          />
          <InputGroupAddon align="inline-end" className="text-xs font-semibold text-muted-foreground px-3">
            USD
          </InputGroupAddon>
        </InputGroup>

        {errors.price && (
          <p className="text-xxs font-medium text-destructive mt-1">
            {errors.price}
          </p>
        )}

        <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
          <Checkbox
            checked={draft.negotiable}
            onCheckedChange={(checked) => onChange({ negotiable: Boolean(checked) })}
          />
          <span className="text-xs sm:text-sm font-medium text-foreground">
            <LocalizedText id="priceIsNegotiableForSeriousBuyers" />
          </span>
        </label>
      </div>

      <div className="space-y-4 pt-2 border-t border-border/60">
        <h3 className="text-xs sm:text-sm font-bold text-foreground">
          <LocalizedText id="itemLocation" />
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="province" className="text-xs font-bold text-foreground">
              <LocalizedText id="provinceCity" /> <span className="text-destructive">*</span>
            </label>
            <Select
              value={draft.location.provinceId ? String(draft.location.provinceId) : ""}
              onValueChange={(val) => handleProvinceChange(val ?? "")}
            >
              <SelectTrigger
                id="province"
                className={`w-full h-10 text-xs sm:text-sm bg-background ${
                  errors["location.provinceId"] ? "border-destructive ring-1 ring-destructive" : ""
                }`}
              >
                <SelectValue placeholder={isLoadingProvinces ? tGenerated("loadingProvinces") : tGenerated("selectProvinceCity")} />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-60">
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={String(province.id)}>
                    {getLocalizedName(province)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["location.provinceId"] && (
              <p className="text-xxs font-medium text-destructive mt-1">
                {errors["location.provinceId"]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="district" className="text-xs font-bold text-foreground">
              <LocalizedText id="districtKhanArea" /> <span className="text-destructive">*</span>
            </label>
            <Select
              value={draft.location.districtId ? String(draft.location.districtId) : ""}
              onValueChange={(val) => handleDistrictChange(val ?? "")}
              disabled={!draft.location.provinceId || isLoadingDistricts}
            >
              <SelectTrigger id="district" className={`w-full h-10 text-xs sm:text-sm bg-background ${errors["location.districtId"] ? "border-destructive ring-1 ring-destructive" : ""}`}>
                <SelectValue placeholder={isLoadingDistricts ? tGenerated("loadingDistricts") : tGenerated("selectDistrictKhan")} />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-60">
                {districts.map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {getLocalizedName(district)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["location.districtId"] && (
              <p className="text-xxs font-medium text-destructive mt-1">
                {errors["location.districtId"]}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="commune" className="text-xs font-bold text-foreground">
              <LocalizedText id="communeSangkat" /> <span className="text-muted-foreground font-normal"><LocalizedText id="optional_c53994" /></span>
            </label>
            <Select
              value={draft.location.communeId ? String(draft.location.communeId) : ""}
              onValueChange={(value) => {
                const communeId = Number(value)
                const selected = communes.find((item) => item.id === communeId)
                const commune = selected ? getLocalizedName(selected) : undefined
                onChange({
                  location: {
                    ...draft.location,
                    communeId,
                    label: [commune, draft.location.district, draft.location.province].filter(Boolean).join(", "),
                  },
                })
              }}
              disabled={!draft.location.districtId || isLoadingCommunes}
            >
              <SelectTrigger id="commune" className="w-full h-10 text-xs sm:text-sm bg-background">
                <SelectValue placeholder={isLoadingCommunes ? tGenerated("loadingCommunes") : tGenerated("selectCommuneSangkat")} />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-60">
                {communes.map((commune) => (
                  <SelectItem key={commune.id} value={String(commune.id)}>
                    {getLocalizedName(commune)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="google-maps-url" className="text-xs font-bold text-foreground">
              <LocalizedText id="googleMapsLink" /> <span className="font-normal text-muted-foreground"><LocalizedText id="optional_c53994" /></span>
            </label>
            <div className="relative">
              <LinkSimple size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="google-maps-url"
                type="url"
                value={draft.location.googleMapsUrl ?? ""}
                onChange={(event) => onChange({
                  location: { ...draft.location, googleMapsUrl: event.target.value },
                })}
                placeholder={tGenerated("pasteAGoogleMapsLocationLink")}
                className={`h-10 w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring sm:text-sm ${
                  errors["location.googleMapsUrl"] ? "border-destructive ring-1 ring-destructive" : "border-input"
                }`}
              />
            </div>
            {errors["location.googleMapsUrl"] ? (
              <p className="text-xxs font-medium text-destructive">{errors["location.googleMapsUrl"]}</p>
            ) : (
              <p className="text-xxs text-muted-foreground"><LocalizedText id="thisExactLocationLinkWillBeVisibleOnThe" /></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
