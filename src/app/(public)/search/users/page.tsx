import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Container } from "@/components/layout/Container"
import { SellerSearchPage } from "@/features/search/components/seller-search-page"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.search")
  return { title: t("title"), description: t("description") }
}

export default function Page() {
  return (
    <Container className="py-4 pb-14">
      <Suspense fallback={null}>
        <SellerSearchPage group="user" />
      </Suspense>
    </Container>
  )
}
