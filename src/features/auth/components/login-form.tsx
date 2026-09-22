"use client"

import { useState } from "react"
import Link from "next/link"
import { User, SpinnerGap } from "@phosphor-icons/react"
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

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
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
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 600)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="identifier"
          className="block text-xs sm:text-sm font-semibold text-foreground"
        >
          Email or Phone Number <span className="text-destructive">*</span>
        </label>

        <InputGroup className="h-11 sm:h-12 rounded-lg" aria-invalid={!!errors.identifier}>
          <InputGroupAddon align="inline-start">
            <User size={18} className="text-muted-foreground" />
          </InputGroupAddon>

          <InputGroupInput
            id="identifier"
            name="identifier"
            type="text"
            value={formData.identifier}
            onChange={(e) => handleChange("identifier", e.target.value)}
            placeholder="Enter your email or phone number"
            autoComplete="username"
            className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
          />
        </InputGroup>

        {errors.identifier && (
          <p className="text-xs font-medium text-destructive mt-1">
            {errors.identifier}
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

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {isLoading ? (
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
