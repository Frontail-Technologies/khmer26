"use client"

import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CategoryFieldDef } from "../../types"

interface DynamicFieldRendererProps {
  fields: CategoryFieldDef[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  errors?: Record<string, string>
}

export function DynamicFieldRenderer({
  fields,
  values,
  onChange,
  errors = {},
}: DynamicFieldRendererProps) {
  if (!fields || fields.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
      {fields.map((field) => {
        const value = values[field.key] || ""
        const error = errors[field.key]

        return (
          <div key={field.key} className="space-y-1.5">
            <label
              htmlFor={field.key}
              className="block text-xs font-bold text-foreground"
            >
              {field.label}{" "}
              {field.required ? (
                <span className="text-destructive">*</span>
              ) : (
                <span className="text-muted-foreground font-normal">(Optional)</span>
              )}
            </label>

            {field.type === "select" && field.options ? (
              <Select
                value={value}
                onValueChange={(val) => onChange(field.key, val ?? "")}
              >
                <SelectTrigger
                  id={field.key}
                  className={`w-full h-10 text-xs sm:text-sm bg-background ${
                    error ? "border-destructive ring-1 ring-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {field.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.unit ? (
              <InputGroup className="h-10 rounded-lg">
                <InputGroupInput
                  id={field.key}
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="text-xs sm:text-sm"
                />
                <InputGroupAddon align="inline-end" className="text-xs font-semibold text-muted-foreground px-3">
                  {field.unit}
                </InputGroupAddon>
              </InputGroup>
            ) : (
              <Input
                id={field.key}
                type={field.type === "number" ? "number" : "text"}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                className={`h-10 text-xs sm:text-sm ${
                  error ? "border-destructive ring-1 ring-destructive" : ""
                }`}
              />
            )}

            {error && (
              <p className="text-[11px] font-medium text-destructive mt-1">
                {error}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
