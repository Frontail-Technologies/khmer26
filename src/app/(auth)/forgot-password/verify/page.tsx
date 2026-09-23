import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { VerificationCodeForm } from "@/features/auth/components/verification-code-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Code",
  description: "Enter the verification code sent to your email or phone number.",
}

export default function VerifyCodePage() {
  return (
    <AuthCard maxWidth="sm" backHref="/forgot-password" backLabel="Back to recovery">
      <AuthHeader
        eyebrow="ACCOUNT RECOVERY"
        title="Enter verification code"
        subtitle="We sent a verification code to the selected email address or phone number."
        align="center"
      />
      <VerificationCodeForm />
    </AuthCard>
  )
}
