import type { Metadata } from "next"
import { AuthCard } from "@/features/auth/components/auth-card"
import { GoogleCallback } from "@/features/auth/components/google-callback"

export const metadata: Metadata = {
  title: "Signing in with Google",
  robots: { index: false, follow: false },
}

export default function GoogleCallbackPage() {
  return (
    <AuthCard maxWidth="sm">
      <GoogleCallback />
    </AuthCard>
  )
}
