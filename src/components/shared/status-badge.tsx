import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * One colour language across admin: green = active/approved, orange (brand) = waiting on someone,
 * red = problem, grey = finished or inactive, blue (brand) = in progress / informational.
 */
export type StatusTone =
  | "neutral"
  | "info"
  | "primary"
  | "success"
  | "warning"
  | "destructive"

interface StatusBadgeProps {
  label: string
  /** Omit to infer the tone from the label (e.g. "pending" → orange). */
  tone?: StatusTone
  icon?: ReactNode
  size?: "sm" | "default"
  className?: string
}

const TONE_CLASSES: Record<StatusTone, { badge: string; dot: string }> = {
  neutral: { badge: "bg-muted text-muted-foreground border-border/70", dot: "bg-muted-foreground/60" },
  info: { badge: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary" },
  primary: { badge: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary" },
  success: { badge: "bg-success/10 text-success border-success/25", dot: "bg-success" },
  warning: { badge: "bg-accent/12 text-accent border-accent/30", dot: "bg-accent" },
  destructive: { badge: "bg-destructive/10 text-destructive border-destructive/25", dot: "bg-destructive" },
}

const IN_PROGRESS = new Set(["in_progress", "processing", "sent", "new", "scheduled"])
const WAITING = new Set(["pending", "pending_review", "in_review", "review", "awaiting", "open", "expiring", "unverified"])
const DONE = new Set(["active", "live", "published", "visible", "online", "approved", "verified", "resolved", "paid", "successful", "success", "completed", "delivered", "accepted"])
const PROBLEM = new Set(["rejected", "flagged", "banned", "suspended", "failed", "blocked", "restricted", "reported", "spam", "deleted", "error", "urgent", "high"])

/** Map any status string to the shared colour language. */
export function statusTone(status: string | null | undefined): StatusTone {
  const key = (status ?? "").toLowerCase().trim().replace(/[\s-]+/g, "_")
  if (DONE.has(key)) return "success"
  if (PROBLEM.has(key)) return "destructive"
  if (WAITING.has(key)) return "warning"
  if (IN_PROGRESS.has(key)) return "info"
  return "neutral"
}

export function StatusBadge({
  label,
  tone,
  icon,
  size = "default",
  className,
}: StatusBadgeProps) {
  const resolved = tone ?? statusTone(label)
  const classes = TONE_CLASSES[resolved] ?? TONE_CLASSES.neutral
  const text = label.replace(/_/g, " ")
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full font-semibold normal-case tracking-normal select-none",
        size === "sm" ? "h-5 px-2 text-2xs" : "h-6 px-2.5 text-xs",
        classes.badge,
        className
      )}
    >
      {icon ? (
        <span className="shrink-0">{icon}</span>
      ) : (
        <span className={cn("size-1.5 shrink-0 rounded-full", classes.dot)} aria-hidden="true" />
      )}
      <span className="truncate first-letter:uppercase">{text}</span>
    </Badge>
  )
}
