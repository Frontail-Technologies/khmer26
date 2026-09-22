"use client"

import { useState } from "react"
import { ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { PasswordField } from "./password-field"
import { AuthSuccessState } from "./auth-success-state"
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/reset-password-schema"

export function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (field: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = resetPasswordSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ResetPasswordFormData
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 500)
  }

  if (isSuccess) {
    return (
      <AuthSuccessState
        title="Password updated"
        description="Your password has been changed successfully."
        actionLabel="Back to Sign In"
        actionHref="/login"
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <PasswordField
        id="newPassword"
        label="New Password"
        placeholder="Enter new password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmNewPassword"
        label="Confirm New Password"
        placeholder="Confirm new password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Updating password...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Reset Password</span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
