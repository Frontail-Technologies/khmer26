"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import Link from "next/link"
import { EnvelopeSimple, SpinnerGap, ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/forgot-password-schema"
import { useForgotPassword, friendlyAuthError, clearResetToken } from "../hooks/use-auth"

export function ForgotPasswordForm() {
  const tGenerated = useTranslations("generated")
  const tValidation = useTranslations("ui.auth.validation")
  const validationMessage = (key: string) => tValidation(key as Parameters<typeof tValidation>[0])
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const forgot = useForgotPassword()

  const handleChange = (value: string) => {
    setFormData({ email: value })
    if (errors.email) setErrors({})
    if (apiError) setApiError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = forgotPasswordSchema.safeParse(formData)

    if (!result.success) {
      setErrors({ email: validationMessage(result.error.issues[0]?.message ?? "enterEmail") })
      return
    }

    setErrors({})
    setApiError(null)
    clearResetToken()
    forgot.mutate(result.data.email, {
      onError: (err) => setApiError(friendlyAuthError(err)),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-semibold text-foreground"
        >
          <LocalizedText id="emailAddress" /> <span className="text-destructive">*</span>
        </label>

        <InputGroup className="h-11 sm:h-12 rounded-lg" aria-invalid={!!errors.email}>
          <InputGroupAddon align="inline-start">
            <EnvelopeSimple size={18} className="text-muted-foreground" />
          </InputGroupAddon>

          <InputGroupInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={tGenerated("enterYourEmailAddress")}
            autoComplete="email"
            className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
          />
        </InputGroup>

        {errors.email && (
          <p className="text-xs font-medium text-destructive mt-1">
            {errors.email}
          </p>
        )}

        {apiError && (
          <p className="text-xs font-medium text-destructive mt-1">
            {apiError}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={forgot.isPending}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {forgot.isPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span><LocalizedText id="sendingCode" /></span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span><LocalizedText id="sendVerificationCode" /></span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <div className="pt-4 text-center text-xs sm:text-sm text-muted-foreground">
        <span><LocalizedText id="rememberYourPassword" /> </span>
        <Link
          href="/login"
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          <LocalizedText id="backToSignIn" />
        </Link>
      </div>
    </form>
  )
}
