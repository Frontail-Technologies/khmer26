"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin } from "@phosphor-icons/react"

const PROVINCES = [
  "All Cambodia",
  "Phnom Penh",
  "Siem Reap",
  "Sihanoukville",
  "Battambang",
  "Kampong Cham",
  "Kandal",
  "Takeo",
  "Kampot",
  "Kratie",
] as const

interface LocationSelectorProps {
  value?: string
  onChange?: (location: string) => void
}

export function LocationSelector({
  value = "All Cambodia",
  onChange,
}: LocationSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm font-normal transition-colors hover:bg-muted"
        aria-label="Select location"
      >
        <MapPin size={14} weight="fill" className="text-primary" aria-hidden="true" />
        <span className="max-w-30 truncate">{value}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Select Province</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PROVINCES.map((province) => (
          <DropdownMenuItem
            key={province}
            onClick={() => onChange?.(province)}
            className={value === province ? "bg-primary/10 text-primary font-medium" : undefined}
          >
            {province}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
