import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { AccountPaymentsView } from "@/features/account/payments/components/account-payments-view"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.payments")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function AccountPaymentsPage() {
  return <AccountPaymentsView />
}
