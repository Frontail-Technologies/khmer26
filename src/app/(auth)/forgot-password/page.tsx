import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your Khmer26 account password via email or phone number.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard maxWidth="sm" backHref="/login" backLabel="Back to sign in">
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title="Forgot your password?"
        subtitle="Enter the email address or phone number associated with your Khmer26 account."
        align="center"
      />
      <ForgotPasswordForm />
    </AuthCard>
  )
}
