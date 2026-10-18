"use client"

import { useTranslations } from "next-intl"
import { LocalizedText } from "@/components/i18n/localized-text"

import {
  Bell,
  ChatCircleDots,
  Heart,
  Tag,
  Sparkle,
  Megaphone,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { AccountSettingsData } from "../../types"

interface NotificationSettingsProps {
  settings: AccountSettingsData["notifications"]
  onChange: (key: keyof AccountSettingsData["notifications"], value: boolean) => void
  disabled?: boolean
}

export function NotificationSettings({
  settings,
  onChange,
  disabled = false,
}: NotificationSettingsProps) {
  const t = useTranslations("ui.account")
  const items = [
    {
      key: "newMessages" as const,
      label: t("notifNewMessages"),
      icon: ChatCircleDots,
    },
    {
      key: "listingFavorites" as const,
      label: t("notifFavorites"),
      icon: Heart,
    },
    {
      key: "listingStatusUpdates" as const,
      label: t("notifListingStatus"),
      icon: Bell,
    },
    {
      key: "priceOffers" as const,
      label: t("notifOffers"),
      icon: Tag,
    },
    {
      key: "promotions" as const,
      label: t("notifPromotions"),
      icon: Sparkle,
    },
    {
      key: "marketplaceAnnouncements" as const,
      label: t("notifPlatform"),
      icon: Megaphone,
    },
  ]

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Bell size={20} weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            <LocalizedText id="notificationPreferences" />
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
