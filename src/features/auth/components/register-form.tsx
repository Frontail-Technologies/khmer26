"use client"

import { useState } from "react"
import Link from "next/link"
import { User, EnvelopeSimple, ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { PasswordField } from "./password-field"
import { PhoneField } from "./phone-field"
import { AuthDivider } from "./auth-divider"
import { SocialAuthButtons } from "./social-auth-buttons"
import { registerSchema, type RegisterFormData } from "../schemas/register-schema"

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    countryCode: "+855",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData
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
          htmlFor="fullName"
          className="block text-xs sm:text-sm font-semibold text-foreground"
        >
          Full Name <span className="text-destructive">*</span>
        </label>

        <InputGroup className="h-11 sm:h-12 rounded-lg" aria-invalid={!!errors.fullName}>
          <InputGroupAddon align="inline-start">
            <User size={18} className="text-muted-foreground" />
          </InputGroupAddon>

          <InputGroupInput
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
          />
        </InputGroup>

        {errors.fullName && (
          <p className="text-xs font-medium text-destructive mt-1">
            {errors.fullName}
          </p>
        )}
      </div>

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
            placeholder="name@example.com"
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

      <PhoneField
        id="phone"
        label="Phone Number"
        countryCode={formData.countryCode}
        onCountryCodeChange={(code) => handleChange("countryCode", code)}
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        error={errors.phone}
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
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
              <span>Creating account...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Create Account</span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <AuthDivider />

      <SocialAuthButtons />

      <div className="pt-4 text-center text-xs sm:text-sm text-muted-foreground">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          Sign in
        </Link>
      </div>
    </form>
  )
}
