import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Field({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  children,
  required,
  ...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label
      data-slot="field-label"
      className={cn("flex items-center gap-1 text-xs font-bold text-foreground", className)}
      {...props}
    >
      {children}
      {required && <span className="text-destructive font-bold text-xs">*</span>}
    </Label>
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-[11px] text-muted-foreground", className)}
      {...props}
    />
  )
}

function FieldError({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-error"
      className={cn("text-[11px] font-medium text-destructive", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, FieldDescription, FieldError }
