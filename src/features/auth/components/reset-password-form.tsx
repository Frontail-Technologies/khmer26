"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { PasswordField } from "./password-field"
import { AuthSuccessState } from "./auth-success-state"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/reset-password-schema"
import { useResetPassword, getResetToken, friendlyAuthError } from "../hooks/use-auth"

export function ResetPasswordForm() {
  const tGenerated = useTranslations("generated")
  const tAuth = useTranslations("ui.authPages")
  const tValidation = useTranslations("ui.auth.validation")
  const validationMessage = (key: string) => tValidation(key as Parameters<typeof tValidation>[0])
  const router = useRouter()
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resetToken] = useState(() => (typeof window !== "undefined" ? getResetToken() : ""))
  const resetPassword = useResetPassword()

  useEffect(() => {
    if (!resetToken) {
      router.replace("/forgot-password")
    }
  }, [resetToken, router])

  const handleChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (apiError) setApiError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = resetPasswordSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ResetPasswordFormData
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = validationMessage(issue.message)
        }
      }
      setErrors(fieldErrors)
      return
    }

    if (!resetToken) {
      setApiError("Session expired. Please restart the password recovery process.")
      return
    }

    setErrors({})
    setApiError(null)
    resetPassword.mutate(
      { resetSecret: resetToken, newPassword: result.data.password },
      {
        onSuccess: () => setIsSuccess(true),
        onError: (err) => setApiError(friendlyAuthError(err)),
      }
    )
  }

  if (isSuccess) {
    return (
      <AuthSuccessState
        title={tGenerated("passwordUpdated")}
        description={tGenerated("passwordChangedSuccessfully")}
        actionLabel={tAuth("backToSignInAction")}
        actionHref="/login"
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <PasswordField
        id="newPassword"
        label={tGenerated("newPassword")}
        placeholder={tGenerated("enterNewPassword")}
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmNewPassword"
        label={tGenerated("confirmNewPassword")}
        placeholder={tGenerated("confirmNewPassword")}
        value={formData.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {apiError && (
        <p className="text-xs font-medium text-destructive text-center">
          {apiError}
        </p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={resetPassword.isPending}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {resetPassword.isPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span><LocalizedText id="updatingPassword" /></span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span><LocalizedText id="resetPassword" /></span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
