import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContentPage } from "@/features/content/api/content.server"
import { PolicyPage } from "@/features/content/components/policy-page"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.postingRules")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function PostingRulesPage() {
  const page = await getContentPage("posting-rules")
  if (!page) notFound()
  return <PolicyPage page={page} />
}
