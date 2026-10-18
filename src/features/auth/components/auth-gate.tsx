"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Container } from "@/components/layout/Container"
import { LoadingState } from "@/components/shared/LoadingState"
import { useCurrentUser } from "../hooks/use-current-user"

/**
 * The middleware only checks that a session cookie exists. This confirms the session is still valid
 * and sends an expired or revoked one to sign-in, then back to the page it was on.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams().toString()
  const signedOut = !isLoading && !isAuthenticated

  useEffect(() => {
    if (!signedOut) return
    const next = search ? `${pathname}?${search}` : pathname
    router.replace(`/login?next=${encodeURIComponent(next)}`)
  }, [signedOut, pathname, search, router])

  if (isLoading || signedOut) {
    return (
      <Container className="py-6">
        <div aria-busy="true">
          <LoadingState variant="list" count={5} />
        </div>
      </Container>
    )
  }

  return <>{children}</>
}
