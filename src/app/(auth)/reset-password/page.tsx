import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your Khmer26 account.",
}

export default function ResetPasswordPage() {
  return (
    <AuthCard maxWidth="sm">
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title="Create a new password"
        subtitle="Choose a new password for your Khmer26 account."
        align="center"
      />
      <ResetPasswordForm />
    </AuthCard>
  )
}
