import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { ProfileView } from "@/features/account/profile/components/profile-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.profile")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountProfilePage() {
  return <ProfileView />
}
