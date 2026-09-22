"use client"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ListingDraft } from "../../types"

interface PriceLocationStepProps {
  draft: ListingDraft
  onChange: (updates: Partial<ListingDraft>) => void
  errors?: Record<string, string>
}

const CAMBODIA_PROVINCES = [
  "Phnom Penh",
  "Kandal",
  "Siem Reap",
  "Battambang",
  "Sihanoukville (Preah Sihanouk)",
  "Kampot",
  "Kampong Cham",
  "Kampong Speu",
  "Kampong Chhnang",
  "Kampong Thom",
  "Koh Kong",
  "Kep",
  "Takeo",
  "Prey Veng",
  "Svay Rieng",
  "Banteay Meanchey",
  "Pursat",
  "Kratie",
  "Stung Treng",
  "Ratanakiri",
  "Mondulkiri",
  "Preah Vihear",
  "Oddar Meanchey",
  "Pailin",
  "Tboung Khmum",
]

export function PriceLocationStep({
  draft,
  onChange,
  errors = {},
}: PriceLocationStepProps) {
  const handlePriceChange = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, "")
    onChange({ price: numeric === "" ? "" : Number(numeric) })
  }

  const handleProvinceChange = (province: string) => {
    const district = draft.location.district || ""
    const label = district ? `${district}, ${province}` : province
    onChange({
      location: {
        province,
        district,
        label,
      },
    })
  }

  const handleDistrictChange = (district: string) => {
    const province = draft.location.province || "Phnom Penh"
    const label = district ? `${district}, ${province}` : province
    onChange({
      location: {
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
          Price (USD) <span className="text-destructive">*</span>
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
          <p className="text-[11px] font-medium text-destructive mt-1">
            {errors.price}
          </p>
        )}

        <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
          <Checkbox
            checked={draft.negotiable}
            onCheckedChange={(checked) => onChange({ negotiable: Boolean(checked) })}
          />
          <span className="text-xs sm:text-sm font-medium text-foreground">
            Price is negotiable for serious buyers
          </span>
        </label>
      </div>

      <div className="space-y-4 pt-2 border-t border-border/60">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            Item Location
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Where is the item located for buyer inspection or pickup?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label htmlFor="province" className="text-xs font-bold text-foreground">
              Province / City <span className="text-destructive">*</span>
            </label>
            <Select
              value={draft.location.province}
              onValueChange={(val) => handleProvinceChange(val ?? "")}
            >
              <SelectTrigger
                id="province"
                className={`w-full h-10 text-xs sm:text-sm bg-background ${
                  errors["location.province"] ? "border-destructive ring-1 ring-destructive" : ""
                }`}
              >
                <SelectValue placeholder="Select Province / City" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-60">
                {CAMBODIA_PROVINCES.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["location.province"] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors["location.province"]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="district" className="text-xs font-bold text-foreground">
              District / Khan / Area <span className="text-destructive">*</span>
            </label>
            <Input
              id="district"
              type="text"
              placeholder="e.g. Chamkarmon, BKK1, Toul Kork"
              value={draft.location.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-10 text-xs sm:text-sm"
            />
            {errors["location.district"] && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {errors["location.district"]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
