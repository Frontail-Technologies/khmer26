import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { SubscriptionView } from "@/features/account/subscription/components/subscription-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.subscription")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountSubscriptionPage() {
  return <SubscriptionView />
}
