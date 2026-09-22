import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: "sm" | "md" | "lg" | "xl"
  as?: "section" | "div" | "article" | "aside"
}

export function Section({
  children,
  className,
  spacing = "md",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      className={cn(
        {
          "py-6":    spacing === "sm",
          "py-10":   spacing === "md",
          "py-16":   spacing === "lg",
          "py-20":   spacing === "xl",
        },
        className,
      )}
    >
      {children}
    </Tag>
  )
}
