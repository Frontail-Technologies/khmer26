import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { RegisterForm } from "@/features/auth/components/register-form"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.register")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function RegisterPage() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  return (
    <AuthCard maxWidth="md" backHref="/" backLabel={tAuth("backToMarketplace")}>
      <AuthHeader
        eyebrow={tAuth("eyebrowJoin")}
        title={tGenerated("createYourKhmer26Account")}
        subtitle={tAuth("subtitleRegister")}
        align="left"
      />
      <RegisterForm />
    </AuthCard>
  )
}
