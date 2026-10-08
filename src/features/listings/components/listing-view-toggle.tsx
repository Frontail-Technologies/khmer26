"use client"

import { SquaresFour, ListBullets } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export type ListingViewMode = "grid" | "list"

interface ListingViewToggleProps {
  viewMode: ListingViewMode
  onChange: (mode: ListingViewMode) => void
  className?: string
}

export function ListingViewToggle({
  viewMode,
  onChange,
  className,
}: ListingViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Listing view mode"
      className={cn(
        "inline-flex items-center rounded-lg bg-muted/40 p-0.5 gap-0.5 shrink-0",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all cursor-pointer",
          viewMode === "grid"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <SquaresFour size={15} weight={viewMode === "grid" ? "fill" : "regular"} />
      </button>

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md text-xs transition-all cursor-pointer",
          viewMode === "list"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ListBullets size={15} weight={viewMode === "list" ? "bold" : "regular"} />
      </button>
    </div>
  )
}
