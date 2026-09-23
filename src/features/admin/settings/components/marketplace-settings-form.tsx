"use client"

import { useState } from "react"
import { FloppyDisk, Storefront } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import type { PlatformSettings } from "../types"

interface MarketplaceSettingsFormProps {
  initialData: PlatformSettings["marketplace"]
}

const APPROVAL_MODE_OPTIONS: SelectOption[] = [
  { value: "ai_flagged_only", label: "AI Guardrails + Flagged Queues (Recommended)" },
  { value: "manual_review", label: "100% Manual Moderator Approval Required" },
  { value: "auto_approve", label: "Instant Auto-Publish Without Pre-Check" },
]

export function MarketplaceSettingsForm({ initialData }: MarketplaceSettingsFormProps) {
  const [formData, setFormData] = useState(initialData)

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Storefront size={14} />
          Marketplace Listing Policies & Limits
        </CardTitle>
        <Button size="sm" className="h-8.5 px-3 text-xs font-bold rounded-lg cursor-pointer">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Settings
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel required>Listing Publishing Mode</FieldLabel>
            <Select
              value={formData.listingApprovalMode}
              items={APPROVAL_MODE_OPTIONS}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  listingApprovalMode: (val ?? "ai_flagged_only") as PlatformSettings["marketplace"]["listingApprovalMode"],
                })
              }
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs w-full rounded-lg">
                <SelectValue placeholder="Approval Mode">
                  {(val) => getSelectOptionLabel(APPROVAL_MODE_OPTIONS, val, "Approval Mode")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {APPROVAL_MODE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel required>Default Listing Duration (Days)</FieldLabel>
            <Input
              type="number"
              value={formData.defaultListingDurationDays}
              onChange={(e) =>
                setFormData({ ...formData, defaultListingDurationDays: Number.parseInt(e.target.value, 10) })
              }
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Max Images per Ad</FieldLabel>
            <Input
              type="number"
              value={formData.maxImagesPerListing}
              onChange={(e) =>
                setFormData({ ...formData, maxImagesPerListing: Number.parseInt(e.target.value, 10) })
              }
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Free Tier Ad Capacity</FieldLabel>
            <Input
              type="number"
              value={formData.freeTierListingLimit}
              onChange={(e) =>
                setFormData({ ...formData, freeTierListingLimit: Number.parseInt(e.target.value, 10) })
              }
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">Instant In-App Chat</span>
              <span className="text-[11px] text-muted-foreground block">
                Allow buyers and sellers to negotiate via real-time messaging on listing pages.
              </span>
            </div>
            <Switch
              checked={formData.allowInstantChat}
              onCheckedChange={(checked) => setFormData({ ...formData, allowInstantChat: checked })}
              aria-label="Toggle instant chat"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">Require Phone OTP Verification</span>
              <span className="text-[11px] text-muted-foreground block">
                Sellers must verify a Cambodian mobile number (+855) before posting listings.
              </span>
            </div>
            <Switch
              checked={formData.requirePhoneVerification}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requirePhoneVerification: checked })
              }
              aria-label="Toggle phone verification"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
