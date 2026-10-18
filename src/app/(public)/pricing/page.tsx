import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { PricingView } from "@/features/payments/components/pricing-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.pricing")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function PricingPage() {
  const t = await getTranslations("payments.pricing")
  return (
    <Container>
      <Section>
        <PageHeader
          title={t("title")}
          description={t("description")}
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        />
        <PricingView />
      </Section>
    </Container>
  )
}
