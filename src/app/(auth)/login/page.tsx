import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { LoginForm } from "@/features/auth/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Khmer26 account to manage ads, chat with buyers, and explore listings.",
}

export default function LoginPage() {
  return (
    <AuthCard maxWidth="sm">
      <AuthHeader
        eyebrow="WELCOME BACK"
        title="Sign in to Khmer26"
        subtitle="Manage your ads, chat with buyers, and make the most of your marketplace experience."
        align="center"
      />
      <LoginForm />
    </AuthCard>
  )
}
