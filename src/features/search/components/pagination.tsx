"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push("...")
      }
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push("...")
      }
      pages.push(totalPages)
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className={cn("flex items-center justify-center gap-1.5 py-6", className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-8.5 px-2.5 text-xs font-medium gap-1"
        aria-label="Go to previous page"
      >
        <CaretLeft size={14} />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((p, index) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8.5 w-8 items-center justify-center text-xs text-muted-foreground"
              >
                ...
              </span>
            )
          }
          const pageNum = Number(p)
          const isActive = pageNum === currentPage
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "flex h-8.5 w-8.5 items-center justify-center rounded-md text-xs font-semibold transition-colors focus:outline-none",
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "border border-border/80 bg-card text-foreground hover:bg-muted"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-8.5 px-2.5 text-xs font-medium gap-1"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <CaretRight size={14} />
      </Button>
    </nav>
  )
}
