import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { VerificationCodeForm } from "@/features/auth/components/verification-code-form"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.forgotPasswordVerify")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function VerifyCodePage() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  return (
    <AuthCard maxWidth="sm" backHref="/forgot-password" backLabel={tAuth("backToRecovery")}>
      <AuthHeader
        eyebrow={tAuth("eyebrowRecovery")}
        title={tGenerated("enterVerificationCode")}
        subtitle={tAuth("subtitleForgotVerify")}
        align="center"
      />
      <VerificationCodeForm />
    </AuthCard>
  )
}
