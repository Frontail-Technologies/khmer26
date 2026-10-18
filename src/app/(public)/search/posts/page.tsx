import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SearchPageContent } from "@/features/search/components/search-page-content"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.search")
  return { title: t("title"), description: t("description") }
}

export default function Page() {
  return (
    <Container className="py-2 pb-14">
      <Suspense fallback={null}>
        <SearchPageContent showSellers={false} />
      </Suspense>
    </Container>
  )
}
