import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.forgotPassword")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function ForgotPasswordPage() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  return (
    <AuthCard maxWidth="sm" backHref="/login" backLabel={tAuth("backToSignIn")}>
      <AuthHeader
        eyebrow={tAuth("eyebrowRecovery")}
        title={tGenerated("forgotYourPassword")}
        subtitle={tAuth("subtitleForgot")}
        align="center"
      />
      <ForgotPasswordForm />
    </AuthCard>
  )
}
