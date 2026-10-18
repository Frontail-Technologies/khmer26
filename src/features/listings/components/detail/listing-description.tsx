"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { splitLinks } from "../../lib/linkify"

interface ListingDescriptionProps {
  description: string | null
}

/** Plain text: line breaks are preserved, web addresses become links, nothing is interpreted as HTML. */
export function ListingDescription({ description }: ListingDescriptionProps) {
  const tGenerated = useTranslations("generated")
  const [isExpanded, setIsExpanded] = useState(false)
  const text = description?.trim()

  if (!text) return null

  const isLong = text.length > 700 || text.split("\n").length > 14

  return (
    <section aria-label={tGenerated("description")} className="space-y-1">
      <p
        className={`max-w-3xl wrap-break-word whitespace-pre-line text-sm leading-6 text-foreground/90 ${
          !isExpanded && isLong ? "line-clamp-10" : ""
        }`}
      >
        {splitLinks(text).map((part, index) =>
          part.type === "link" ? (
            <a
              key={index}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="break-all text-primary hover:underline"
            >
              {part.value}
            </a>
          ) : (
            part.value
          )
        )}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          {isExpanded ? (
            <>
              <span><LocalizedText id="showLess" /></span>
              <CaretUp size={13} weight="bold" />
            </>
          ) : (
            <>
              <span><LocalizedText id="readMore" /></span>
              <CaretDown size={13} weight="bold" />
            </>
          )}
        </button>
      )}
    </section>
  )
}
