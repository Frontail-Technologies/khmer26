"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import {
  LockKey,
  Phone,
  UserPlus,
  Eye,
  Star,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { AccountSettingsData } from "../../types"

interface PrivacySettingsProps {
  settings: AccountSettingsData["privacy"]
  onChange: (key: keyof AccountSettingsData["privacy"], value: boolean) => void
  disabled?: boolean
}

export function PrivacySettings({
  settings,
  onChange,
  disabled = false,
}: PrivacySettingsProps) {
  const t = useTranslations("ui.account")
  const items = [
    {
      key: "showPhoneNumber" as const,
      label: t("privacyShowPhone"),
      icon: Phone,
    },
    {
      key: "allowBuyersFollow" as const,
      label: t("privacyAllowFollow"),
      icon: UserPlus,
    },
    {
      key: "showActiveStatus" as const,
      label: t("privacyShowActive"),
      icon: Eye,
    },
    {
      key: "showSellerRating" as const,
      label: t("privacyShowRating"),
      icon: Star,
    },
  ]

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <LockKey size={20} weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            <LocalizedText id="privacyVisibility" />
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60">
        {items.map((item) => {
          const Icon = item.icon
          const isChecked = settings[item.key]

          return (
            <div
              key={item.key}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0 mt-0.5">
                  <Icon size={16} />
                </div>
                <span className="font-bold text-xs sm:text-sm text-foreground block">
                  {item.label}
                </span>
              </div>

              <Switch
                checked={isChecked}
                disabled={disabled}
                onCheckedChange={(checked) => onChange(item.key, checked)}
                aria-label={item.label}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
