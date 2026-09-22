"use client"

import {
  Bell,
  ChatCircleDots,
  Heart,
  Tag,
  Sparkle,
  Megaphone,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { AccountSettingsData } from "../../types"

interface NotificationSettingsProps {
  settings: AccountSettingsData["notifications"]
  onChange: (key: keyof AccountSettingsData["notifications"], value: boolean) => void
}

export function NotificationSettings({
  settings,
  onChange,
}: NotificationSettingsProps) {
  const items = [
    {
      key: "newMessages" as const,
      label: "New Messages & Inquiries",
      description: "Get notified immediately when buyers or sellers send you direct messages.",
      icon: ChatCircleDots,
    },
    {
      key: "listingFavorites" as const,
      label: "Listing Favorites",
      description: "Receive updates when other users add your items to their saved favorites.",
      icon: Heart,
    },
    {
      key: "listingStatusUpdates" as const,
      label: "Listing Status & Approvals",
      description: "Notifications when your ads are approved, published, expired, or reviewed.",
      icon: Bell,
    },
    {
      key: "priceOffers" as const,
      label: "Price Offers & Bids",
      description: "Alerts when a buyer submits a direct price offer or negotiation request.",
      icon: Tag,
    },
    {
      key: "promotions" as const,
      label: "Discounts & Promotion Credits",
      description: "Special seller boost discounts, seasonal events, and platform credits.",
      icon: Sparkle,
    },
    {
      key: "marketplaceAnnouncements" as const,
      label: "Platform Updates & Safety Notices",
      description: "Important security alerts and system announcements from the Khmer26 team.",
      icon: Megaphone,
    },
  ]

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <Bell size={20} weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            Notification Preferences
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Choose which notifications you receive across email and in-app alerts.
        </CardDescription>
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
                <div>
                  <span className="font-bold text-xs sm:text-sm text-foreground block">
                    {item.label}
                  </span>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <Switch
                checked={isChecked}
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
