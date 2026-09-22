import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "cn"

export type StatusTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "accent"
  | "primary"

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
  icon?: ReactNode
  size?: "sm" | "default"
  className?: string
}

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  success: "bg-primary/10 text-primary border-primary/20",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  primary: "bg-primary text-primary-foreground border-primary",
}

export function StatusBadge({
  label,
  tone = "neutral",
  icon,
  size = "default",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold uppercase tracking-wider gap-1 select-none",
        size === "sm" ? "text-[9px] sm:text-[10px] px-1.5 py-0.5" : "text-[10px] sm:text-xs px-2 py-0.5",
        TONE_CLASSES[tone],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>
    </Badge>
  )
}
