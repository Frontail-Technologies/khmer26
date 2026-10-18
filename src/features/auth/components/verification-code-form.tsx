"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  verificationCodeSchema,
  type VerificationCodeFormData,
} from "../schemas/verification-code-schema"
import {
  useVerifyResetOtp,
  useForgotPassword,
  getAuthPendingEmail,
  friendlyAuthError,
} from "../hooks/use-auth"

const RESEND_COOLDOWN_SEC = 60

export function VerificationCodeForm() {
  const tGenerated = useTranslations("generated")
  const tValidation = useTranslations("ui.auth.validation")
  const validationMessage = (key: string) => tValidation(key as Parameters<typeof tValidation>[0])
  const tDynamic = useTranslations("dynamic")
  const [formData, setFormData] = useState<VerificationCodeFormData>({ code: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationCodeFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SEC)
  const [email] = useState(() => (typeof window !== "undefined" ? getAuthPendingEmail() : ""))

  const verifyOtp = useVerifyResetOtp()
  const resend = useForgotPassword()

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  const handleChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6)
    setFormData({ code: cleaned })
    if (errors.code) setErrors({})
    if (apiError) setApiError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = verificationCodeSchema.safeParse(formData)

    if (!result.success) {
      setErrors({ code: validationMessage(result.error.issues[0]?.message ?? "enterCode") })
      return
    }

    if (!email) {
      setApiError("Session expired. Please restart the password recovery process.")
      return
    }

    setErrors({})
    setApiError(null)
    verifyOtp.mutate(
      { email, otp: result.data.code },
      { onError: (err) => setApiError(friendlyAuthError(err)) }
    )
  }

  const handleResend = useCallback(() => {
    if (!email || countdown > 0 || resend.isPending) return
    resend.mutate(email, {
      onSuccess: () => setCountdown(RESEND_COOLDOWN_SEC),
      onError: (err) => setApiError(friendlyAuthError(err)),
    })
  }, [email, countdown, resend])

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="code"
          className="block text-xs sm:text-sm font-semibold text-foreground text-center"
        >
          <LocalizedText id="verificationCode" /> <span className="text-destructive">*</span>
        </label>

        <div className="flex justify-center">
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={formData.code}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="······"
            autoComplete="one-time-code"
            className="h-12 max-w-60 text-center font-mono text-xl tracking-[0.5em] font-bold rounded-lg shadow-2xs"
            aria-invalid={!!errors.code}
          />
        </div>

        {errors.code && (
          <p className="text-xs font-medium text-destructive text-center mt-1">
            {errors.code}
          </p>
        )}

        {apiError && (
          <p className="text-xs font-medium text-destructive text-center mt-1">
            {apiError}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={verifyOtp.isPending || formData.code.length < 6}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {verifyOtp.isPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span><LocalizedText id="verifying" /></span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span><LocalizedText id="verifyCode" /></span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 pt-3 text-xs sm:text-sm text-muted-foreground text-center">
        <div className="flex items-center gap-1.5">
          <span><LocalizedText id="didnTReceiveACode" /></span>
          {countdown > 0 ? (
            <span className="font-bold text-muted-foreground">
              {tDynamic("resendIn", { seconds: countdown })}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resend.isPending}
              className="font-bold text-primary hover:underline cursor-pointer focus:outline-none disabled:opacity-50"
            >
              {resend.isPending ? tGenerated("sending") : tGenerated("resendCode")}
            </button>
          )}
        </div>

        <div>
          <Link
            href="/forgot-password"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            <LocalizedText id="changeEmailAddress" />
          </Link>
        </div>
      </div>
    </form>
  )
}
