import type { Metadata } from "next"
import { Suspense } from "react"
import { SettingsWorkspace } from "@/features/admin/settings/components/settings-workspace"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage Khmer26 marketplace settings.",
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsWorkspace />
    </Suspense>
  )
}
