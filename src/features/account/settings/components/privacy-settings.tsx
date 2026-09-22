"use client"

import {
  LockKey,
  Phone,
  UserPlus,
  Eye,
  Star,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { AccountSettingsData } from "../../types"

interface PrivacySettingsProps {
  settings: AccountSettingsData["privacy"]
  onChange: (key: keyof AccountSettingsData["privacy"], value: boolean) => void
}

export function PrivacySettings({
  settings,
  onChange,
}: PrivacySettingsProps) {
  const items = [
    {
      key: "showPhoneNumber" as const,
      label: "Show Phone Number Publicly",
      description: "Display your contact phone number directly on all active listing detail pages.",
      icon: Phone,
    },
    {
      key: "allowBuyersFollow" as const,
      label: "Allow Buyers to Follow Me",
      description: "Let registered marketplace buyers follow your store and get notified of new listings.",
      icon: UserPlus,
    },
    {
      key: "showActiveStatus" as const,
      label: "Show Online / Active Status",
      description: "Show a green indicator when you are actively browsing or responding to messages.",
      icon: Eye,
    },
    {
      key: "showSellerRating" as const,
      label: "Show Seller Rating Publicly",
      description: "Display your average star rating and positive review feedback score on your profile.",
      icon: Star,
    },
  ]

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-2xs">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center gap-2 text-primary">
          <LockKey size={20} weight="fill" />
          <CardTitle className="text-base font-bold text-foreground">
            Privacy & Visibility
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Control how your profile and contact information appear across the marketplace.
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
