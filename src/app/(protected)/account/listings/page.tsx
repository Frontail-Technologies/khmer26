import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { AccountListingsView } from "@/features/account/listings/components/account-listings-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.myListings")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function MyListingsPage() {
  return <AccountListingsView />
}
