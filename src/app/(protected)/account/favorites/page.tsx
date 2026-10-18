import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { AccountFavoritesView } from "@/features/account/favorites/components/account-favorites-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.favorites")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountFavoritesPage() {
  return <AccountFavoritesView />
}
