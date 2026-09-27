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

export function AdminMetricItem({
  label,
  value,
  subtext,
  icon,
  tone = "neutral",
  valueClassName,
}: AdminMetricItemProps) {
  return (
    <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider truncate">
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              "size-8.5 rounded-lg flex items-center justify-center shrink-0 border",
              TONE_CONTAINER_CLASSES[tone]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-0.5 min-w-0">
        <span
          className={cn(
            "text-xl sm:text-2xl font-black tracking-tight block truncate",
            valueClassName || TONE_VALUE_CLASSES[tone]
          )}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-muted-foreground block truncate font-medium">
            {subtext}
          </span>
        )}
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
  3: "grid-cols-1 sm:grid-cols-3",
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
        "rounded-xl bg-card shadow-2xs overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "grid divide-y sm:divide-y-0 sm:divide-x divide-border/30",
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
