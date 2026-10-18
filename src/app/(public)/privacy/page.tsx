import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContentPage } from "@/features/content/api/content.server"
import { PolicyPage } from "@/features/content/components/policy-page"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.privacy")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function PrivacyPage() {
  const page = await getContentPage("privacy")
  if (!page) notFound()
  return <PolicyPage page={page} />
}
