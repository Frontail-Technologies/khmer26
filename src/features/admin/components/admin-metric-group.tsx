import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type AdminMetricTone = "neutral" | "primary" | "accent" | "success" | "warning" | "destructive" | "info" | "indigo" | "purple"

export interface AdminMetricItemProps {
  label: string
  value: string | number
  subtext?: string
  icon?: ReactNode
  tone?: AdminMetricTone
  valueClassName?: string
}

const TONE_CONTAINER_CLASSES: Record<AdminMetricTone, string> = {
  neutral: "bg-muted/60 text-muted-foreground border-transparent",
  primary: "bg-primary/10 text-primary border-transparent",
  accent: "bg-accent/10 text-accent border-transparent",
  success: "bg-success/10 text-success border-transparent",
  warning: "bg-warning/10 text-warning border-transparent",
  destructive: "bg-destructive/10 text-destructive border-transparent",
  info: "bg-info/10 text-info border-transparent",
  indigo: "bg-primary/10 text-primary border-transparent",
  purple: "bg-accent/10 text-accent border-transparent",
}

const TONE_VALUE_CLASSES: Record<AdminMetricTone, string> = {
  neutral: "text-foreground",
  primary: "text-foreground",
  accent: "text-accent",
  success: "text-foreground",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-foreground",
  indigo: "text-foreground",
  purple: "text-foreground",
}

/** Compact KPI tile: tinted icon, big tabular number, short label. Sub-text is intentionally not shown. */
export function AdminMetricItem({
  label,
  value,
  icon,
  tone = "neutral",
  valueClassName,
}: AdminMetricItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 bg-card p-3.5 sm:p-4.5">
      {icon && (
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl border sm:size-11",
            TONE_CONTAINER_CLASSES[tone]
          )}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <span
          className={cn(
            "block truncate text-xl font-extrabold leading-tight tracking-tight tabular-nums sm:text-2xl",
            valueClassName || TONE_VALUE_CLASSES[tone]
          )}
        >
          {value}
        </span>
        <span className="block truncate text-2xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-xxs">
          {label}
        </span>
      </div>
    </div>
  )
}

interface AdminMetricGroupProps {
  metrics: AdminMetricItemProps[]
  columns?: 2 | 3 | 4 | 5
  className?: string
}

const GRID_COLS_CLASSES: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
}

export function AdminMetricGroup({
  metrics,
  columns = 4,
  className,
}: AdminMetricGroupProps) {
  const colClass = GRID_COLS_CLASSES[columns] || GRID_COLS_CLASSES[4]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs",
        className
      )}
    >
      <div
        className={cn(
          // gap-px over a border-coloured background draws even hairline dividers at any column count.
          "grid gap-px bg-border/50",
          colClass
        )}
      >
        {metrics.map((metric, idx) => (
          <AdminMetricItem key={idx} {...metric} />
        ))}
      </div>
    </div>
  )
}
