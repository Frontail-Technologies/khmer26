import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg"
  backHref?: string
  backLabel?: string
}

export function AuthCard({
  children,
  className,
  maxWidth = "md",
  backHref,
  backLabel = "Back",
}: AuthCardProps) {
  const widthClasses = {
    sm: "max-w-[460px]",
    md: "max-w-[500px]",
    lg: "max-w-[540px]",
  }

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center py-6 sm:py-10 md:py-12 px-3 sm:px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      {backHref && (
        <div className={cn("w-full mb-3 flex items-center justify-start", widthClasses[maxWidth])}>
          <Link
            href={backHref}
            aria-label={backLabel}
            className="inline-flex h-9 items-center gap-1.5 px-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-95"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>{backLabel}</span>
          </Link>
        </div>
      )}
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
