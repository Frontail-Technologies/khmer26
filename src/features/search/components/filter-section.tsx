"use client"

import { useState, type ReactNode } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export const OPTION_BUTTON_BASE =
  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors"
export const OPTION_BUTTON_ACTIVE = "font-semibold text-primary bg-primary/10 ring-1 ring-primary/20"
export const OPTION_BUTTON_IDLE = "text-muted-foreground hover:bg-muted hover:text-foreground"

export const PILL_BASE = "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors"
export const PILL_ACTIVE = "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
export const PILL_IDLE = "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"

interface FilterSectionProps {
  title: string
  icon?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}

export function FilterSection({ title, icon, defaultOpen = true, children }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border/50 pb-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-xs font-bold text-foreground tracking-tight"
      >
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{title}</span>
        </div>
        <CaretDown
          size={12}
          className={cn(
            "transition-transform duration-200 text-muted-foreground",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  )
}
