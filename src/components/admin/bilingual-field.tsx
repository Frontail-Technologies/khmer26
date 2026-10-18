"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface BilingualFieldProps {
  id: string
  label: string
  valueEn: string
  valueKm: string
  onChangeEn: (value: string) => void
  onChangeKm: (value: string) => void
  /** English is the source text and the fallback, so it is the one that can be required. */
  required?: boolean
  multiline?: boolean
  maxLength?: number
  rows?: number
  placeholderEn?: string
  placeholderKm?: string
  /** One column even on wide screens, for narrow panels. */
  stacked?: boolean
  className?: string
}

/** The same value in English and Khmer, side by side. Khmer is optional; empty falls back to English. */
export function BilingualField({
  id,
  label,
  valueEn,
  valueKm,
  onChangeEn,
  onChangeKm,
  required,
  multiline,
  maxLength,
  rows = 4,
  placeholderEn,
  placeholderKm = "ខ្មែរ",
  stacked,
  className,
}: BilingualFieldProps) {
  const control = (lang: "en" | "km") => {
    const shared = {
      id: `${id}-${lang}`,
      value: lang === "en" ? valueEn : valueKm,
      maxLength,
      lang,
      placeholder: lang === "en" ? placeholderEn : placeholderKm,
      onChange: (event: { target: { value: string } }) => (lang === "en" ? onChangeEn : onChangeKm)(event.target.value),
    }
    return multiline ? <Textarea rows={rows} {...shared} /> : <Input {...shared} />
  }

  return (
    <div className={cn("grid gap-4", !stacked && "sm:grid-cols-2", className)}>
      <Field>
        <FieldLabel htmlFor={`${id}-en`} required={required}>
          {label} · English
        </FieldLabel>
        {control("en")}
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-km`}>{label} · ខ្មែរ</FieldLabel>
        {control("km")}
      </Field>
    </div>
  )
}
