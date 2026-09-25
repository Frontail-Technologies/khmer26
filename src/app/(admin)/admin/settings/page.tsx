import type { Metadata } from "next"
import { SettingsWorkspace } from "@/features/admin/settings/components/settings-workspace"
import { DEMO_PLATFORM_SETTINGS } from "@/features/admin/settings/data/demo-settings-data"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage Khmer26 marketplace settings.",
}

export default function AdminSettingsPage() {
  return <SettingsWorkspace initialSettings={DEMO_PLATFORM_SETTINGS} />
}
