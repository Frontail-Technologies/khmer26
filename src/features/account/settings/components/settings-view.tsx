"use client"

import { useState } from "react"
import { AccountPageHeader } from "../../components/account-page-header"
import { NotificationSettings } from "./notification-settings"
import { PrivacySettings } from "./privacy-settings"
import { AppearanceSettings } from "./appearance-settings"
import { SecuritySettings } from "./security-settings"
import { DEMO_SETTINGS } from "../../data/demo-account-data"
import type { AccountSettingsData } from "../../types"

export function SettingsView() {
  const [settings, setSettings] = useState<AccountSettingsData>(DEMO_SETTINGS)

  const handleNotificationChange = (
    key: keyof AccountSettingsData["notifications"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const handlePrivacyChange = (
    key: keyof AccountSettingsData["privacy"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  const handleLanguageChange = (language: "en" | "km") => {
    setSettings((prev) => ({ ...prev, language }))
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title="Account Settings"
        description="Manage your notification preferences, privacy, language, appearance, and security."
      />

      <div className="space-y-6">
        <NotificationSettings
          settings={settings.notifications}
          onChange={handleNotificationChange}
        />

        <PrivacySettings
          settings={settings.privacy}
          onChange={handlePrivacyChange}
        />

        <AppearanceSettings
          language={settings.language}
          onLanguageChange={handleLanguageChange}
        />

        <SecuritySettings />
      </div>
    </div>
  )
}
