"use client"

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
  useVerifyRegistration,
  useResendRegistrationOtp,
  getAuthPendingEmail,
  friendlyAuthError,
} from "../hooks/use-auth"

const RESEND_COOLDOWN_SEC = 60

export function RegisterVerifyForm() {
  const [formData, setFormData] = useState<VerificationCodeFormData>({ code: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationCodeFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SEC)
  const [email] = useState(() => (typeof window !== "undefined" ? getAuthPendingEmail() : ""))

  const verify = useVerifyRegistration()
  const resend = useResendRegistrationOtp()

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
      setErrors({ code: result.error.issues[0]?.message ?? "Please enter the 6-digit code" })
      return
    }

    if (!email) {
      setApiError("Session expired. Please register again.")
      return
    }

    setErrors({})
    setApiError(null)
    verify.mutate(
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
          Verification code <span className="text-destructive">*</span>
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
          disabled={verify.isPending || formData.code.length < 6}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {verify.isPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Verify &amp; Continue</span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 pt-3 text-xs sm:text-sm text-muted-foreground text-center">
        <div className="flex items-center gap-1.5">
          <span>Didn&apos;t receive a code?</span>
          {countdown > 0 ? (
            <span className="font-bold text-muted-foreground">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resend.isPending}
              className="font-bold text-primary hover:underline cursor-pointer focus:outline-none disabled:opacity-50"
            >
              {resend.isPending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>

        <div>
          <Link
            href="/register"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            Change email address
          </Link>
        </div>
      </div>
    </form>
  )
}
