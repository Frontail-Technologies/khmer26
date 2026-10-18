import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { NotificationsView } from "@/features/notifications/components/notifications-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.notifications")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountNotificationsPage() {
  return <NotificationsView />
}
