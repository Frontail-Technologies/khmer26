import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { SettingsView } from "@/features/account/settings/components/settings-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.settings")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountSettingsPage() {
  return <SettingsView />
}
