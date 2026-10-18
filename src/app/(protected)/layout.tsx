import { Suspense } from "react"
import { AuthGate } from "@/features/auth/components/auth-gate"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  )
}
