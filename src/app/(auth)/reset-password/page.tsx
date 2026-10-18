import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta.resetPassword")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function ResetPasswordPage() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  return (
    <AuthCard maxWidth="sm" backHref="/forgot-password/verify" backLabel={tAuth("backToVerification")}>
      <AuthHeader
        eyebrow={tAuth("eyebrowRecovery")}
        title={tGenerated("createANewPassword")}
        subtitle={tAuth("subtitleReset")}
        align="center"
      />
      <ResetPasswordForm />
    </AuthCard>
  )
}
