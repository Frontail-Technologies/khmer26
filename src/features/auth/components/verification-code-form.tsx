"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, SpinnerGap } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  verificationCodeSchema,
  type VerificationCodeFormData,
} from "../schemas/verification-code-schema"

export function VerificationCodeForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<VerificationCodeFormData>({
    code: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationCodeFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6)
    setFormData({ code: cleaned })
    if (errors.code) {
      setErrors({})
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = verificationCodeSchema.safeParse(formData)

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Please enter the 6-digit code"
      setErrors({ code: message })
      return
    }

    setErrors({})
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/reset-password")
    }, 400)
  }

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
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading || formData.code.length < 6}
          className="w-full h-11 sm:h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm sm:text-base rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Verify Code</span>
              <ArrowRight size={18} weight="bold" />
            </span>
          )}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2 pt-3 text-xs sm:text-sm text-muted-foreground text-center">
        <div className="flex items-center gap-1.5">
          <span>Didn&apos;t receive a code?</span>
          <button
            type="button"
            className="font-bold text-primary hover:underline cursor-pointer focus:outline-none"
          >
            Resend code in 00:45
          </button>
        </div>

        <div>
          <Link
            href="/forgot-password"
            className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
          >
            Change email or phone number
          </Link>
        </div>
      </div>
    </form>
  )
}
