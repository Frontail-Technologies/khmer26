"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, SpinnerGap, ArrowRight } from "@phosphor-icons/react"
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

export function ForgotPasswordForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    identifier: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (value: string) => {
    setFormData({ identifier: value })
    if (errors.identifier) {
      setErrors({})
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = forgotPasswordSchema.safeParse(formData)

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Please enter your email or phone number"
      setErrors({ identifier: message })
      return
    }

    setErrors({})
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/forgot-password/verify")
    }, 400)
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
            onChange={(e) => handleChange(e.target.value)}
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

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Sending code...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Send verification code</span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <div className="pt-4 text-center text-xs sm:text-sm text-muted-foreground">
        <span>Remember your password? </span>
        <Link
          href="/login"
          className="font-bold text-primary hover:underline transition-colors ml-1"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  )
}
