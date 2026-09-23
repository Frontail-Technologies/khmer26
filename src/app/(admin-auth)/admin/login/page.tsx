import type { Metadata } from "next"
import { AdminLoginForm } from "@/features/admin/auth/components/admin-login-form"

export const metadata: Metadata = {
  title: "Admin Portal Sign In — Khmer26",
  description: "Secure internal management login for Khmer26 marketplace administrators.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background py-8 px-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
      <AdminLoginForm />
    </div>
  )
}
