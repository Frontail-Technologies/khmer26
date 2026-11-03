"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { LocalizedText } from "@/components/i18n/localized-text"
import { friendlyAuthError, useGoogleAuth } from "../hooks/use-auth"
import { consumeGoogleRedirect } from "../lib/google-redirect"

/** Finishes a Google redirect sign-in: reads the token from the URL fragment and signs in with it. */
export function GoogleCallback() {
  const [error, setError] = useState<string | null>(null)
  const [next, setNext] = useState("/")
  const googleAuth = useGoogleAuth()
  const startedRef = useRef(false)

  useEffect(() => {
    // Strict Mode runs effects twice; the pending sign-in can only be consumed once.
    if (startedRef.current) return
    startedRef.current = true

    const result = consumeGoogleRedirect(window.location.hash)
    // Drop the token from the address bar and history.
    window.history.replaceState(null, "", window.location.pathname)

    void Promise.resolve().then(async () => {
      setNext(result.next)
      if (!result.ok) {
        setError(
          result.reason === "cancelled"
            ? "Google sign-in was cancelled."
            : result.reason === "invalid"
              ? "This Google sign-in link has expired. Please try again."
              : "Google sign-in failed. Please try again."
        )
        return
      }
      try {
        await googleAuth.mutateAsync({ accessToken: result.accessToken, next: result.next })
      } catch (err) {
        setError(friendlyAuthError(err))
      }
    })
    // Runs once on arrival; googleAuth is stable enough for a one-shot call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loginHref = next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button className="w-full h-11 rounded-lg" render={<Link href={loginHref} replace />}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground" role="status">
      <SpinnerGap size={18} className="animate-spin" />
      <span><LocalizedText id="signingIn" /></span>
    </div>
  )
}
