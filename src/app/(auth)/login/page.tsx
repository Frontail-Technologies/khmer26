import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { LoginForm } from "@/features/auth/components/login-form"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.login")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function LoginPage() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  return (
    <AuthCard maxWidth="sm" backHref="/" backLabel={tAuth("backToMarketplace")}>
      <AuthHeader
        eyebrow={tAuth("eyebrowWelcomeBack")}
        title={tGenerated("signInToKhmer26")}
        subtitle={tAuth("subtitleLogin")}
        align="center"
      />
      <LoginForm />
    </AuthCard>
  )
}
