"use client"

import { CaretDown, Phone } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface CountryOption {
  code: string
  dialCode: string
  name: string
  flag: string
}

const COUNTRIES: CountryOption[] = [
  { code: "KH", dialCode: "+855", name: "Cambodia", flag: "🇰🇭" },
  { code: "TH", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "LA", dialCode: "+856", name: "Laos", flag: "🇱🇦" },
]

function CambodiaFlagMini() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 40" className="rounded-xs shrink-0 shadow-2xs" aria-hidden="true">
      <rect width="60" height="10" fill="#032ea1" />
      <rect y="10" width="60" height="20" fill="#e00025" />
      <rect y="30" width="60" height="10" fill="#032ea1" />
      <g fill="#ffffff">
        <path d="M22 25h16v-1.5h-16z M24 23.5h12v-4h-12z M25 19.5l5-5.5 5 5.5z M23 21.5l2-3 2 3z M33 21.5l2-3 2 3z M20 25h20v1.5H20z" />
      </g>
    </svg>
  )
}

interface PhoneFieldProps {
  id: string
  label: string
  countryCode: string
  onCountryCodeChange: (code: string) => void
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

export function PhoneField({
  id,
  label,
  countryCode,
  onCountryCodeChange,
  value,
  onChange,
  error,
  required = true,
}: PhoneFieldProps) {
  const selectedCountry =
    COUNTRIES.find((c) => c.dialCode === countryCode) ?? COUNTRIES[0]

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-semibold text-foreground"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <InputGroup className="h-11 sm:h-12 rounded-lg" aria-invalid={!!error}>
        <InputGroupAddon align="inline-start" className="pr-1 border-r border-border/70">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-1.5 py-1 px-1 text-xs font-semibold text-foreground hover:bg-muted rounded transition-colors focus:outline-none cursor-pointer"
              aria-label="Select country code"
            >
              <Phone size={16} className="text-muted-foreground mr-0.5" />
              {selectedCountry.code === "KH" ? (
                <CambodiaFlagMini />
              ) : (
                <span className="text-sm">{selectedCountry.flag}</span>
              )}
              <span className="text-xs font-bold">{selectedCountry.dialCode}</span>
              <CaretDown size={11} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1 shadow-lg">
              {COUNTRIES.map((c) => (
                <DropdownMenuItem
                  key={c.code}
                  onClick={() => onCountryCodeChange(c.dialCode)}
                  className="flex items-center justify-between text-xs cursor-pointer py-1.5 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </div>
                  <span className="text-muted-foreground font-mono font-semibold">
                    {c.dialCode}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          id={id}
          name={id}
          type="tel"
          value={value}
          onChange={onChange}
          placeholder="12 345 678"
          autoComplete="tel"
          className="text-xs sm:text-sm text-foreground placeholder:text-muted-foreground pl-3"
        />
      </InputGroup>

      {error && (
        <p className="text-xs font-medium text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}
