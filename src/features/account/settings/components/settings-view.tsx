"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { AccountPageHeader } from "../../components/account-page-header"
import { NotificationSettings } from "./notification-settings"
import { PrivacySettings } from "./privacy-settings"
import { AppearanceSettings } from "./appearance-settings"
import { SecuritySettings } from "./security-settings"
import type { AccountSettingsData } from "../../types"
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/features/notifications/api/notifications.queries"
import { usePrivacyPreferences, useUpdatePrivacyPreferences } from "../api/settings.queries"

const DEFAULT_NOTIFICATIONS: AccountSettingsData["notifications"] = {
  newMessages: true,
  listingFavorites: true,
  listingStatusUpdates: true,
  priceOffers: true,
  promotions: true,
  marketplaceAnnouncements: true,
}

const DEFAULT_PRIVACY: AccountSettingsData["privacy"] = {
  showPhoneNumber: true,
  allowBuyersFollow: true,
  showActiveStatus: true,
  showSellerRating: true,
}

export function SettingsView() {
  const tGenerated = useTranslations("generated")
  const notificationPreferences = useNotificationPreferences()
  const updateNotifications = useUpdateNotificationPreferences()
  const privacyPreferences = usePrivacyPreferences()
  const updatePrivacy = useUpdatePrivacyPreferences()
  const hasLoadError = notificationPreferences.isError || privacyPreferences.isError

  const handleNotificationChange = (
    key: keyof AccountSettingsData["notifications"],
    value: boolean
  ) => {
    updateNotifications.mutate({ [key]: value })
  }

  const handlePrivacyChange = (
    key: keyof AccountSettingsData["privacy"],
    value: boolean
  ) => {
    updatePrivacy.mutate({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader title={tGenerated("accountSettings")} />

      <div className="space-y-6">
        {hasLoadError && (
          <div role="alert" className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-destructive"><LocalizedText id="somePreferencesCouldNotBeLoadedChangesAreDisabled" /></p>
            <button
              type="button"
              className="shrink-0 font-bold text-foreground underline underline-offset-4"
              onClick={() => {
                void notificationPreferences.refetch()
                void privacyPreferences.refetch()
              }}
            >
              <LocalizedText id="tryAgain" />
            </button>
          </div>
        )}
        <NotificationSettings
          settings={notificationPreferences.data ?? DEFAULT_NOTIFICATIONS}
          onChange={handleNotificationChange}
          disabled={notificationPreferences.isPending || notificationPreferences.isError || updateNotifications.isPending}
        />

        <PrivacySettings
          settings={privacyPreferences.data ?? DEFAULT_PRIVACY}
          onChange={handlePrivacyChange}
          disabled={privacyPreferences.isPending || privacyPreferences.isError || updatePrivacy.isPending}
        />

        <AppearanceSettings />

        <SecuritySettings />
      </div>
    </div>
  )
}
