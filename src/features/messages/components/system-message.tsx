"use client"

import { useLocalizedText } from "@/lib/i18n/use-localized-text"

interface SystemMessageProps {
  content: string
  contentKm?: string
}

export function SystemMessage({ content, contentKm }: SystemMessageProps) {
  const localized = useLocalizedText()
  return (
    <div className="flex justify-center my-3">
      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xxs font-semibold text-center max-w-md shadow-2xs border border-border/50">
        {localized(content, contentKm)}
      </span>
    </div>
  )
}
