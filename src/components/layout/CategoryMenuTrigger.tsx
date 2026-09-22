"use client"

import { Button } from "@/components/ui/button"
import { SquaresFour } from "@phosphor-icons/react"

export function CategoryMenuTrigger() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 font-medium"
      aria-label="Browse all categories"
      aria-haspopup="dialog"
    >
      <SquaresFour size={18} weight="fill" aria-hidden="true" />
      <span className="hidden sm:inline">Categories</span>
    </Button>
  )
}
