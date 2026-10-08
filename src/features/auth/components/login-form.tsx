"use client"

import { useState } from "react"
import Link from "next/link"
import { EnvelopeSimple, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PasswordField } from "./password-field"
import { AuthDivider } from "./auth-divider"
import { SocialAuthButtons } from "./social-auth-buttons"
import { loginSchema, type LoginFormData } from "../schemas/login-schema"
import { useLogin, friendlyAuthError } from "../hooks/use-auth"

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const login = useLogin()

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (apiError) setApiError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setApiError(null)
    login.mutate(
      { email: result.data.email, password: result.data.password },
      { onError: (err) => setApiError(friendlyAuthError(err)) }
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-semibold text-foreground"
        >
          Email Address <span className="text-destructive">*</span>
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
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
          />
        </InputGroup>

        {errors.email && (
          <p className="text-xs font-medium text-destructive mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="flex justify-end pt-0.5">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-primary hover:underline transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {apiError && (
        <p className="text-xs font-medium text-destructive text-center -mt-1">
          {apiError}
        </p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={login.isPending}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {login.isPending ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <span>Sign In</span>
          )}
        </Button>
      </div>

      <AuthDivider />

      <SocialAuthButtons />

      <div className="pt-4 text-center text-xs sm:text-sm text-muted-foreground">
        <span>Don&apos;t have an account? </span>
        <Link
          href="/register"
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          Create an account
        </Link>
      </div>
    </form>
  )
}
