import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { RegisterVerifyForm } from "@/features/auth/components/register-verify-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Enter the verification code sent to your email to complete registration.",
}

export default function RegisterVerifyPage() {
  return (
    <AuthCard maxWidth="sm" backHref="/register" backLabel="Back to registration">
      <AuthHeader
        eyebrow="EMAIL VERIFICATION"
        title="Check your inbox"
        subtitle="We sent a 6-digit verification code to your email address. Enter it below to complete your registration."
        align="center"
      />
      <RegisterVerifyForm />
    </AuthCard>
  )
}
