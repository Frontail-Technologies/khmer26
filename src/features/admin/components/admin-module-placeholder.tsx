import type { ReactNode } from "react"
import {
  MagnifyingGlass,
  Database,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
  type SelectOption,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface AdminModuleMetric {
  label: string
  value: string | number
  change?: string
  trend?: "up" | "down"
  variant?: "default" | "warning" | "destructive" | "success"
}

export interface AdminModuleFilter {
  id: string
  label: string
  placeholder?: string
  options: Array<{ label: string; value: string }>
}

export interface AdminModuleColumn {
  header: string
  width?: string
  align?: "left" | "center" | "right"
}

export interface AdminModulePlaceholderProps {
  title: string
  description?: string
  badge?: string | number
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  actions?: ReactNode
  metrics?: AdminModuleMetric[]
  searchPlaceholder?: string
  filters?: AdminModuleFilter[]
  columns: AdminModuleColumn[]
  emptyTitle?: string
  emptyDescription?: string
}

export function AdminModulePlaceholder({
  metrics = [],
  searchPlaceholder = "Search records...",
  filters = [],
  columns,
  emptyTitle = "No records loaded",
  emptyDescription = "Connect backend API to stream live data into this workspace.",
}: AdminModulePlaceholderProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      {metrics.length > 0 && (
        <div
          className={cn(
            "grid gap-2.5 sm:gap-3",
            metrics.length === 1
              ? "grid-cols-1"
              : metrics.length === 2
              ? "grid-cols-2"
              : metrics.length === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {metrics.map((metric, idx) => {
            const isUp = metric.trend === "up"
            const isDown = metric.trend === "down"

            return (
              <Card
                key={idx}
                className="rounded-xl border-0 bg-card p-3 sm:p-3.5 shadow-2xs"
              >
                <CardContent className="p-0 space-y-1">
                  <div className="flex items-center justify-between gap-1 text-[11px] text-muted-foreground font-medium">
                    <span className="truncate">{metric.label}</span>
                    {metric.change && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-[10px] font-bold shrink-0",
                          isUp
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isDown
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {isUp ? (
                          <TrendUp size={11} weight="bold" />
                        ) : isDown ? (
                          <TrendDown size={11} weight="bold" />
                        ) : null}
                        <span>{metric.change}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "text-lg sm:text-xl font-bold tracking-tight",
                        metric.variant === "destructive"
                          ? "text-destructive"
                          : metric.variant === "warning"
                          ? "text-amber-600 dark:text-amber-400"
                          : metric.variant === "success"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      )}
                    >
                      {metric.value}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="rounded-xl bg-card shadow-2xs overflow-hidden">
        <div className="p-3 sm:p-3.5 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="h-8.5 w-full pl-8 pr-3 text-xs bg-muted/40 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {filters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {filters.map((filter) => {
                const selectOptions: SelectOption[] = [
                  { value: "all", label: filter.placeholder || filter.label },
                  ...filter.options,
                ]
                return (
                  <div key={filter.id} className="min-w-36">
                    <Select defaultValue="all" items={selectOptions}>
                      <SelectTrigger size="sm" className="h-8.5 text-xs bg-muted/40 rounded-lg">
                        <SelectValue placeholder={filter.placeholder || filter.label}>
                          {(val) => getSelectOptionLabel(selectOptions, val, filter.placeholder || filter.label)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent side="bottom" align="start">
                        {selectOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/35 text-muted-foreground border-b border-border/60 select-none">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "py-2.5 px-3.5 font-semibold text-[11px] tracking-wide",
                      col.width,
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="py-12 sm:py-16 px-4 text-center">
                  <div className="max-w-sm mx-auto space-y-2.5">
                    <div className="size-9 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                      <Database size={17} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">{emptyTitle}</p>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        {emptyDescription}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium text-muted-foreground border-border/80"
                    >
                      Backend Integration Ready
                    </Badge>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
