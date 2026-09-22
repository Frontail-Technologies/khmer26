import { Container } from "@/components/layout/Container"
import { PageHeader } from "@/components/layout/PageHeader"
import { Section } from "@/components/layout/Section"
import { EmptyState } from "@/components/shared/EmptyState"
import { CurrencyDollar } from "@phosphor-icons/react/dist/ssr"

export const metadata = {
  title: "Pricing & Subscription Plans",
  description: "Choose a plan to post more listings and grow your business on Khmer26.",
}

export default function PricingPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Subscription Plans"
          description="Post more, sell more. Choose the plan that fits your needs."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        />
        <EmptyState
          icon={<CurrencyDollar size={32} aria-hidden="true" />}
          title="Pricing Plans Coming Soon"
          description="Subscription tiers and pricing will be fetched from the backend and displayed here."
          action={{ label: "Post an Ad", href: "/post-ad" }}
        />
      </Section>
    </Container>
  )
}
