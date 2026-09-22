"use client"

import { useState } from "react"
import { Eye, EyeSlash, Lock } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  autoComplete?: string
  required?: boolean
}

export function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete = "current-password",
  required = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-semibold text-foreground"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <InputGroup className="h-11 sm:h-12 rounded-lg" aria-invalid={!!error}>
        <InputGroupAddon align="inline-start">
          <Lock size={18} className="text-muted-foreground" />
        </InputGroupAddon>

        <InputGroupInput
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground"
        />

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {error && (
        <p className="text-xs font-medium text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}
