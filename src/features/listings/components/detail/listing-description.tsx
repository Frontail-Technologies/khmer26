"use client"

import { useState } from "react"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface ListingDescriptionProps {
  description: string | null
}

/** Plain text only: line breaks are preserved and nothing is interpreted as HTML. */
export function ListingDescription({ description }: ListingDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const text = description?.trim()

  if (!text) return null

  const isLong = text.length > 700 || text.split("\n").length > 14

  return (
    <section aria-label="Description" className="space-y-2.5">
      <h2 className="text-sm sm:text-base font-bold text-foreground">Description</h2>
      <p
        className={`wrap-break-word whitespace-pre-line text-sm leading-relaxed text-foreground/90 sm:text-[15px] ${
          !isExpanded && isLong ? "line-clamp-10" : ""
        }`}
      >
        {text}
      </p>

      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 gap-1 px-2 text-xs font-semibold text-primary"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <CaretUp size={14} weight="bold" />
            </>
          ) : (
            <>
              <span>Read more</span>
              <CaretDown size={14} weight="bold" />
            </>
          )}
        </Button>
      )}
    </section>
  )
}
