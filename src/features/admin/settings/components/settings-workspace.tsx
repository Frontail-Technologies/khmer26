"use client"

import { useState } from "react"
import { Check, FloppyDisk } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import type { PlatformSettings, GeneralSettings, MarketplaceSettings } from "../types"
import { cn } from "@/lib/utils"

interface SettingsWorkspaceProps {
  initialSettings: PlatformSettings
}

type SettingsTabKey = "general" | "marketplace"

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "km", label: "Khmer (ភាសាខ្មែរ)" },
  { value: "en", label: "English" },
]

const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "Asia/Phnom_Penh", label: "Asia/Phnom_Penh (UTC+7, Cambodia Time)" },
]

const LISTING_STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active (Auto-published)" },
  { value: "under_review", label: "Under Review (Manual Approval)" },
]

const DURATION_OPTIONS: SelectOption[] = [
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
]

export function SettingsWorkspace({ initialSettings }: SettingsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("general")
  const [general, setGeneral] = useState<GeneralSettings>(initialSettings.general)
  const [marketplace, setMarketplace] = useState<MarketplaceSettings>(initialSettings.marketplace)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
    }, 2500)
  }

  const tabs: { key: SettingsTabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "marketplace", label: "Marketplace" },
  ]

  return (
    <div className="space-y-3.5 sm:space-y-4">
      <div className="min-w-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
        <div className="border-b border-border/60 bg-muted/20 px-3 sm:px-4 pt-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 border-transparent",
                    isActive
                      ? "bg-card text-foreground border-primary shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-6 max-w-2xl">
          {activeTab === "general" ? (
            <div className="space-y-4 text-xs">
              <Field>
                <FieldLabel required>Marketplace Name</FieldLabel>
                <input
                  type="text"
                  required
                  value={general.marketplaceName}
                  onChange={(e) =>
                    setGeneral((prev) => ({ ...prev, marketplaceName: e.target.value }))
                  }
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel required>Support Email</FieldLabel>
                  <input
                    type="email"
                    required
                    value={general.supportEmail}
                    onChange={(e) =>
                      setGeneral((prev) => ({ ...prev, supportEmail: e.target.value }))
                    }
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>

                <Field>
                  <FieldLabel required>Support Phone</FieldLabel>
                  <input
                    type="text"
                    required
                    value={general.supportPhone}
                    onChange={(e) =>
                      setGeneral((prev) => ({ ...prev, supportPhone: e.target.value }))
                    }
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel required>Primary Language</FieldLabel>
                  <Select
                    value={general.primaryLanguage}
                    items={LANGUAGE_OPTIONS}
                    onValueChange={(val) =>
                      setGeneral((prev) => ({
                        ...prev,
                        primaryLanguage: (val as "km" | "en") ?? "km",
                      }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue placeholder="Primary Language">
                        {(val) => getSelectOptionLabel(LANGUAGE_OPTIONS, val, "Khmer")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel required>Platform Timezone</FieldLabel>
                  <Select
                    value={general.timezone}
                    items={TIMEZONE_OPTIONS}
                    onValueChange={(val) =>
                      setGeneral((prev) => ({
                        ...prev,
                        timezone: val ?? "Asia/Phnom_Penh",
                      }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue placeholder="Timezone">
                        {(val) => getSelectOptionLabel(TIMEZONE_OPTIONS, val, "Asia/Phnom_Penh")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel required>Free Tier Listing Quota</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={marketplace.freeListingLimit}
                    onChange={(e) =>
                      setMarketplace((prev) => ({
                        ...prev,
                        freeListingLimit: Number.parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </Field>

                <Field>
                  <FieldLabel required>Listing Expiry Duration</FieldLabel>
                  <Select
                    value={String(marketplace.listingDurationDays)}
                    items={DURATION_OPTIONS}
                    onValueChange={(val) =>
                      setMarketplace((prev) => ({
                        ...prev,
                        listingDurationDays: Number.parseInt(val ?? "30", 10),
                      }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue placeholder="Duration">
                        {(val) => getSelectOptionLabel(DURATION_OPTIONS, val, "30 Days")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel required>Default New Listing Moderation Status</FieldLabel>
                <Select
                  value={marketplace.defaultListingStatus}
                  items={LISTING_STATUS_OPTIONS}
                  onValueChange={(val) =>
                    setMarketplace((prev) => ({
                      ...prev,
                      defaultListingStatus: (val as "active" | "under_review") ?? "active",
                    }))
                  }
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder="Listing status">
                      {(val) =>
                        getSelectOptionLabel(LISTING_STATUS_OPTIONS, val, "Active (Auto-published)")
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LISTING_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="p-3.5 rounded-xl bg-background border border-border/70 flex items-center justify-between gap-4 mt-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-semibold text-xs text-foreground block">
                    Seller Posting Availability
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    Allow registered marketplace users and sellers to publish new classified listings.
                  </p>
                </div>
                <Switch
                  checked={marketplace.sellerPostingEnabled}
                  onCheckedChange={(checked) =>
                    setMarketplace((prev) => ({
                      ...prev,
                      sellerPostingEnabled: checked,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-border/60">
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="h-9 px-4 text-xs font-bold rounded-lg cursor-pointer"
            >
              <FloppyDisk size={14} className="mr-1.5" />
              Save Settings
            </Button>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-200">
                <Check size={14} weight="bold" />
                Settings updated successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
