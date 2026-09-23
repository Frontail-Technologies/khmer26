"use client"

import { useState } from "react"
import { FloppyDisk, Globe } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface GeneralSettingsFormProps {
  initialData: PlatformSettings["general"]
}

const CURRENCY_OPTIONS: SelectOption[] = [
  { value: "USD", label: "USD ($ - United States Dollar)" },
  { value: "KHR", label: "KHR (៛ - Khmer Riel)" },
]

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "km", label: "ភាសាខ្មែរ (Khmer - Default)" },
  { value: "en", label: "English" },
]

export function GeneralSettingsForm({ initialData }: GeneralSettingsFormProps) {
  const [formData, setFormData] = useState(initialData)

  return (
    <Card className="bg-card border-0 rounded-xl shadow-2xs">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Globe size={14} />
          General Platform & Localization Settings
        </CardTitle>
        <Button size="sm" className="h-8.5 px-3 text-xs font-bold rounded-lg cursor-pointer">
          <FloppyDisk size={14} className="mr-1.5" />
          Save Settings
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel required>Marketplace Title / Brand</FieldLabel>
            <Input
              value={formData.marketplaceName}
              onChange={(e) => setFormData({ ...formData, marketplaceName: e.target.value })}
              className="h-9.5 text-xs font-semibold rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Support Contact Email</FieldLabel>
            <Input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Support Hotline Number</FieldLabel>
            <Input
              type="tel"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="h-9.5 text-xs rounded-lg"
            />
          </Field>

          <Field>
            <FieldLabel required>Default Pricing Currency</FieldLabel>
            <Select
              value={formData.defaultCurrency}
              items={CURRENCY_OPTIONS}
              onValueChange={(val) => setFormData({ ...formData, defaultCurrency: (val ?? "USD") as "USD" | "KHR" })}
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs w-full rounded-lg">
                <SelectValue placeholder="Currency">
                  {(val) => getSelectOptionLabel(CURRENCY_OPTIONS, val, "Currency")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel required>Primary Platform Language</FieldLabel>
            <Select
              value={formData.defaultLanguage}
              items={LANGUAGE_OPTIONS}
              onValueChange={(val) => setFormData({ ...formData, defaultLanguage: (val ?? "km") as "km" | "en" })}
            >
              <SelectTrigger size="sm" className="h-9.5 text-xs w-full rounded-lg">
                <SelectValue placeholder="Language">
                  {(val) => getSelectOptionLabel(LANGUAGE_OPTIONS, val, "Language")}
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
            <FieldLabel>Official System Timezone</FieldLabel>
            <Input
              value={formData.timezone}
              disabled
              className="h-9.5 text-xs bg-muted/40 font-mono rounded-lg"
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}
