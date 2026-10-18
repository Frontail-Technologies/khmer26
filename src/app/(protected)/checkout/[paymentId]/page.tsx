import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.checkout")
  return {
    title: t("title"),
    robots: { index: false }
  }
}

export default function CheckoutPage() {
  redirect("/account/payments")
}
