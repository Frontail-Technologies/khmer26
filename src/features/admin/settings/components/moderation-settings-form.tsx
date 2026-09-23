"use client"

import { useState } from "react"
import { FloppyDisk, ShieldWarning } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel } from "@/components/ui/field"
import type { PlatformSettings } from "../types"

interface ModerationSettingsFormProps {
  initialData: PlatformSettings["moderation"]
}

export function ModerationSettingsForm({ initialData }: ModerationSettingsFormProps) {
  const [formData, setFormData] = useState(initialData)

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ShieldWarning size={14} />
          Automated Moderation & Risk Thresholds
        </CardTitle>
        <Button size="sm" className="h-8.5 px-3 text-xs font-bold rounded-lg cursor-pointer">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Settings
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel required>High-Value Inspection Threshold ($ USD)</FieldLabel>
            <Input
              type="number"
              value={formData.highValueThresholdUsd}
              onChange={(e) =>
                setFormData({ ...formData, highValueThresholdUsd: Number.parseInt(e.target.value, 10) })
              }
              className="h-9.5 text-xs font-semibold rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Reports Before Automated Delisting</FieldLabel>
            <Input
              type="number"
              value={formData.maxReportsBeforeAutoDelist}
              onChange={(e) =>
                setFormData({ ...formData, maxReportsBeforeAutoDelist: Number.parseInt(e.target.value, 10) })
              }
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>
        </div>

        <div className="space-y-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">Auto-Flag Advance Deposit Keywords</span>
              <span className="text-[11px] text-muted-foreground block">
                Flag Telegram links, bank account deposit requests, and off-platform redirection terms.
              </span>
            </div>
            <Switch
              checked={formData.autoFlagSuspiciousKeywords}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, autoFlagSuspiciousKeywords: checked })
              }
              aria-label="Toggle keyword flag"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">Enforce Identity for Real Estate & Vehicles</span>
              <span className="text-[11px] text-muted-foreground block">
                Sellers must complete National ID verification before posting in Car or Property categories.
              </span>
            </div>
            <Switch
              checked={formData.requireIdForVehicleRealEstate}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requireIdForVehicleRealEstate: checked })
              }
              aria-label="Toggle ID requirement"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
