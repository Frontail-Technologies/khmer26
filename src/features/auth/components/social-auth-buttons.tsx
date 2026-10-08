"use client"

import { useEffect, useRef, useState } from "react"
import { SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useGoogleAuth, useTelegramAuth, friendlyAuthError } from "../hooks/use-auth"
import type { TelegramAuthPayload } from "../api/auth.api"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string
            callback: (res: { credential: string }) => void
            auto_select?: boolean
            ux_mode?: "popup" | "redirect"
          }) => void
          renderButton: (
            parent: HTMLElement,
            opts: {
              type?: "standard" | "icon"
              theme?: "outline" | "filled_blue" | "filled_black"
              size?: "large" | "medium" | "small"
              text?: "signin_with" | "signup_with" | "continue_with" | "signin"
              width?: number
            }
          ) => void
        }
      }
    }
    Telegram?: {
      Login: {
        auth: (
          opts: { bot_id: number; request_access?: boolean | string; lang?: string },
          callback: (data: TelegramAuthPayload | false) => void
        ) => void
      }
    }
    onTelegramAuth?: (data: TelegramAuthPayload) => void
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""
const TELEGRAM_BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID
  ? Number(process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID)
  : 0

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
    </svg>
  )
}

function useGsiLoaded() {
  const [loaded, setLoaded] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      setTimeout(() => setLoaded(true), 0)
      return
    }

    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      const poll = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(poll)
          setLoaded(true)
        }
      }, 100)
      return () => clearInterval(poll)
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])

  return { loaded, initialized }
}

function useTelegramLoaded() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!TELEGRAM_BOT_ID) return

    if (typeof window !== "undefined" && window.Telegram?.Login) {
      setTimeout(() => setLoaded(true), 0)
      return
    }

    if (document.querySelector('script[src*="telegram-widget.js"]')) {
      const poll = setInterval(() => {
        if (window.Telegram?.Login) {
          clearInterval(poll)
          setLoaded(true)
        }
      }, 100)
      return () => clearInterval(poll)
    }

    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-widget.js?22"
    script.async = true
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)
  }, [])

  return loaded
}

const GOOGLE_BUTTON_NATIVE_HEIGHT = 40

export function SocialAuthButtons({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [telegramError, setTelegramError] = useState<string | null>(null)
  const googleSlotRef = useRef<HTMLDivElement>(null)
  const googleWrapRef = useRef<HTMLDivElement>(null)

  const googleAuth = useGoogleAuth()
  const telegramAuth = useTelegramAuth()
  const { loaded: gsiLoaded } = useGsiLoaded()
  const telegramLoaded = useTelegramLoaded()

  const onCredentialRef = useRef<(credential: string) => void>(() => {})
  useEffect(() => {
    onCredentialRef.current = (credential: string) => {
      setGoogleError(null)
      googleAuth.mutate(credential, {
        onSuccess: () => onSuccess?.(),
        onError: (err) => setGoogleError(friendlyAuthError(err)),
      })
    }
  })

  // Google renders its own click-to-open popup account chooser; we overlay it
  // invisibly on our styled button. Popup close/cancel fires no callback, so no error is shown.
  useEffect(() => {
    const slot = googleSlotRef.current
    const wrap = googleWrapRef.current
    if (!gsiLoaded || !GOOGLE_CLIENT_ID || !slot || !wrap || !window.google?.accounts?.id) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      ux_mode: "popup",
      auto_select: false,
      callback: (response) => onCredentialRef.current(response.credential),
    })

    const render = () => {
      const width = Math.round(wrap.clientWidth)
      slot.innerHTML = ""
      window.google!.accounts.id.renderButton(slot, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        width,
      })
      slot.style.transform = `scaleY(${wrap.clientHeight / GOOGLE_BUTTON_NATIVE_HEIGHT})`
    }
    render()

    const observer = new ResizeObserver(render)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [gsiLoaded])

  const handleGoogleFallbackClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setGoogleError("Google sign-in is not configured.")
      return
    }
    if (!gsiLoaded) {
      setGoogleError("Google sign-in is loading. Please try again.")
    }
  }

  const handleTelegramAuth = () => {
    if (!TELEGRAM_BOT_ID) {
      setTelegramError("Telegram sign-in is not configured.")
      return
    }
    if (!telegramLoaded || !window.Telegram?.Login) {
      setTelegramError("Telegram sign-in is loading. Please try again.")
      return
    }
    setTelegramError(null)
    window.Telegram.Login.auth(
      { bot_id: TELEGRAM_BOT_ID, request_access: "write" },
      (data) => {
        if (!data) {
          setTelegramError("Telegram sign-in was cancelled.")
          return
        }
        telegramAuth.mutate(data, {
          onSuccess: () => onSuccess?.(),
          onError: (err) => setTelegramError(friendlyAuthError(err)),
        })
      }
    )
  }

  const googlePending = googleAuth.isPending
  const telegramPending = telegramAuth.isPending

  return (
    <div className="space-y-2.5">
      <div className="space-y-1">
        <div ref={googleWrapRef} className="group relative mx-auto h-11 w-full max-w-100 sm:h-12">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleFallbackClick}
            disabled={googlePending}
            className="w-full h-full border-border/90 bg-card text-foreground group-hover:bg-muted font-semibold text-xs sm:text-sm gap-2.5 rounded-lg cursor-pointer shadow-2xs transition-colors"
          >
            {googlePending ? (
              <span className="flex items-center gap-2">
                <SpinnerGap size={18} className="animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <GoogleIcon />
                <span>Continue with Google</span>
              </>
            )}
          </Button>
          <div
            ref={googleSlotRef}
            aria-hidden="true"
            className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg opacity-0 ${
              googlePending ? "pointer-events-none" : ""
            }`}
          />
        </div>
        {googleError && (
          <p className="text-xs text-destructive text-center">{googleError}</p>
        )}
      </div>

      <div className="space-y-1">
        <Button
          type="button"
          onClick={handleTelegramAuth}
          disabled={telegramPending}
          className="w-full h-11 sm:h-12 bg-[#229ED9] text-white hover:bg-[#1C8ACB] font-semibold text-xs sm:text-sm gap-2.5 rounded-lg cursor-pointer shadow-2xs transition-colors"
        >
          {telegramPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <>
              <TelegramIcon />
              <span>Continue with Telegram</span>
            </>
          )}
        </Button>
        {telegramError && (
          <p className="text-xs text-destructive text-center">{telegramError}</p>
        )}
      </div>
    </div>
  )
}
