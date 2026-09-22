import { AuthCard } from "@/features/auth/components/auth-card"
import { AuthHeader } from "@/features/auth/components/auth-header"
import { RegisterForm } from "@/features/auth/components/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your free Khmer26 account to start posting ads and connecting with buyers across Cambodia.",
}

export default function RegisterPage() {
  return (
    <AuthCard maxWidth="md">
      <AuthHeader
        eyebrow="JOIN KHMER26"
        title="Create your Khmer26 account"
        subtitle="Join thousands of buyers and sellers across Cambodia. Post ads, save your favorites, and get more opportunities."
        align="left"
      />
      <RegisterForm />
    </AuthCard>
  )
}
