"use client"

import { useState } from "react"
import { Article, CaretDown, CaretUp } from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ListingDescriptionProps {
  description: string
}

export function ListingDescription({ description }: ListingDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = description.length > 400

  const paragraphs = description.split("\n\n").filter(Boolean)

  return (
    <Card className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <CardHeader className="p-0 pb-3 sm:pb-4 flex flex-row items-center gap-2">
        <Article size={18} className="text-primary shrink-0" />
        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
          Description
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div
          className={`space-y-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal ${
            !isExpanded && isLong ? "line-clamp-6" : ""
          }`}
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {isLong && (
          <div className="pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="h-8 text-xs font-semibold text-primary hover:text-primary/80 p-0 gap-1"
            >
              <span>{isExpanded ? "Show Less" : "Read Full Description"}</span>
              {isExpanded ? (
                <CaretUp size={14} weight="bold" />
              ) : (
                <CaretDown size={14} weight="bold" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
