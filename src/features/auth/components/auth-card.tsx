import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg"
}

export function AuthCard({
  children,
  className,
  maxWidth = "md",
}: AuthCardProps) {
  const widthClasses = {
    sm: "max-w-[460px]",
    md: "max-w-[500px]",
    lg: "max-w-[540px]",
  }

  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-10 md:py-12 px-3 sm:px-4">
      <Card
        className={cn(
          "w-full rounded-2xl border-border/80 p-5 sm:p-8 shadow-sm text-foreground",
          widthClasses[maxWidth],
          className
        )}
      >
        {children}
      </Card>
    </div>
  )
}
