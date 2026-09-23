"use client"

import { useState } from "react"
import { FloppyDisk, LockKey, Info } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
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

interface SecuritySettingsFormProps {
  initialData: PlatformSettings["security"]
}

const TWO_FACTOR_OPTIONS: SelectOption[] = [
  { value: "all_staff", label: "All Staff Members (Required)" },
  { value: "admin_only", label: "Super Admins & Admins Only" },
  { value: "optional", label: "Optional for All Roles" },
]

export function SecuritySettingsForm({ initialData }: SecuritySettingsFormProps) {
  const [formData, setFormData] = useState(initialData)

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <LockKey size={14} />
          Admin Session & Security Governance
        </CardTitle>
        <Button size="sm" className="h-8 text-xs">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Settings
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-xs">
        <div className="p-3 rounded-lg bg-muted/40 border-0 flex items-start gap-2 text-muted-foreground">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Security policies configure server authentication bounds. Changes require active Super Administrator credentials to take effect across API gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field className="gap-2">
            <FieldLabel>Session Expiry (Hours)</FieldLabel>
            <Input
              type="number"
              value={formData.sessionTimeoutHours}
              onChange={(e) =>
                setFormData({ ...formData, sessionTimeoutHours: Number.parseInt(e.target.value, 10) })
              }
              className="h-8 text-xs"
            />
          </Field>

          <Field className="gap-2">
            <FieldLabel>Staff 2FA Requirement</FieldLabel>
            <Select
              value={formData.twoFactorRequirement}
              items={TWO_FACTOR_OPTIONS}
              onValueChange={(val) =>
                setFormData({
                  ...formData,
                  twoFactorRequirement: (val ?? "all_staff") as PlatformSettings["security"]["twoFactorRequirement"],
                })
              }
            >
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue placeholder="2FA Policy">
                  {(val) => getSelectOptionLabel(TWO_FACTOR_OPTIONS, val, "2FA Policy")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {TWO_FACTOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field className="gap-2">
            <FieldLabel>Max Failed Login Attempts</FieldLabel>
            <Input
              type="number"
              value={formData.maxLoginAttempts}
              onChange={(e) =>
                setFormData({ ...formData, maxLoginAttempts: Number.parseInt(e.target.value, 10) })
              }
              className="h-8 text-xs"
            />
          </Field>
        </div>

        <div className="pt-2 border-t border-border/60">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/70">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">Admin Console IP Whitelisting</span>
              <span className="text-[11px] text-muted-foreground block">
                Restrict access to /admin portal exclusively to office VPN and static IP ranges.
              </span>
            </div>
            <Switch
              checked={formData.ipWhitelistingEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, ipWhitelistingEnabled: checked })
              }
              aria-label="Toggle IP whitelisting"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
