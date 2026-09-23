import type { Metadata } from "next"
import { SettingsWorkspace } from "@/features/admin/settings/components/settings-workspace"
import { DEMO_PLATFORM_SETTINGS } from "@/features/admin/settings/data/demo-settings-data"

export const metadata: Metadata = {
  title: "Platform Settings",
  description: "Platform configuration, security policies, and localization preferences.",
}

export default function AdminSettingsPage() {
  return <SettingsWorkspace settings={DEMO_PLATFORM_SETTINGS} />
}
