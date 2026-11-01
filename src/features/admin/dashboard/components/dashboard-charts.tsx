"use client"

import { useId, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

/** Chart series colours come from theme tokens so light/dark stay consistent. */
export type ChartTone = "primary" | "success" | "accent" | "info" | "warning" | "destructive"

export const TONE_VAR: Record<ChartTone, string> = {
  primary: "var(--color-primary)",
  success: "var(--color-success)",
  accent: "var(--color-accent)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  destructive: "var(--color-destructive)",
}

function buildPath(values: number[], width: number, height: number, pad = 2) {
  const max = Math.max(...values, 1)
  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0
  const points = values.map((value, index) => [pad + index * step, height - pad - (value / max) * (height - pad * 2)] as const)
  // Smooth with a light cardinal-style curve so spikes don't look jagged.
  let line = `M${points[0]?.[0] ?? 0},${points[0]?.[1] ?? height}`
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]!
    const [x1, y1] = points[i]!
    const cx = (x0 + x1) / 2
    line += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
  }
  const area = `${line} L${points.at(-1)?.[0] ?? width},${height} L${points[0]?.[0] ?? 0},${height} Z`
  return { line, area, points, max }
}

/** Tiny trend line with a soft gradient fill, for KPI cards. */
export function Sparkline({ values, tone = "primary", className }: { values: number[]; tone?: ChartTone; className?: string }) {
  const id = useId()
  const { line, area } = useMemo(() => buildPath(values.length ? values : [0, 0], 120, 36), [values])
  return (
    <svg viewBox="0 0 120 36" preserveAspectRatio="none" className={cn("h-9 w-full overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={TONE_VAR[tone]} stopOpacity="0.28" />
          <stop offset="100%" stopColor={TONE_VAR[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={TONE_VAR[tone]} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface AreaChartProps {
  labels: string[]
  values: number[]
  tone: ChartTone
  formatValue: (value: number) => string
  className?: string
}

/** Responsive area chart with gridlines and a hover/tap readout. */
export function AreaChart({ labels, values, tone, formatValue, className }: AreaChartProps) {
  const id = useId()
  const W = 640
  const H = 220
  const { line, area, points, max } = useMemo(() => buildPath(values.length ? values : [0, 0], W, H, 6), [values])
  const [active, setActive] = useState<number | null>(null)
  const shown = active ?? values.length - 1

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setActive(Math.max(0, Math.min(values.length - 1, Math.round(ratio * (values.length - 1)))))
  }

  const point = points[shown]
  return (
    <div className={cn("relative", className)}>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-3xl">
          {formatValue(values[shown] ?? 0)}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{labels[shown]}</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="h-44 w-full touch-none overflow-visible sm:h-56"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setActive(null)}
        role="img"
        aria-label={`Trend, peak ${formatValue(max)}`}
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={TONE_VAR[tone]} stopOpacity="0.32" />
            <stop offset="100%" stopColor={TONE_VAR[tone]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--color-border)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#${id})`} className="transition-[d] duration-500" />
        <path d={line} fill="none" stroke={TONE_VAR[tone]} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="transition-[d] duration-500" />
        {point && (
          <>
            <line x1={point[0]} x2={point[0]} y1="0" y2={H} stroke={TONE_VAR[tone]} strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
            <circle cx={point[0]} cy={point[1]} r="5" fill="var(--color-card)" stroke={TONE_VAR[tone]} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>
      <div className="mt-2 flex justify-between text-2xs font-medium text-muted-foreground tabular-nums">
        <span>{labels[0]}</span>
        <span>{labels[Math.floor(labels.length / 2)]}</span>
        <span>{labels.at(-1)}</span>
      </div>
    </div>
  )
}

export interface DonutSlice {
  label: string
  value: number
  tone: ChartTone | "muted"
}

/** Donut with the total in the centre. */
export function Donut({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel: string }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const R = 42
  const C = 2 * Math.PI * R
  let offset = 0
  return (
    <div className="relative mx-auto size-40 sm:size-44">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-muted)" strokeWidth="11" />
        {total > 0 &&
          slices.map((slice) => {
            const length = (slice.value / total) * C
            const dash = `${Math.max(length - 1.2, 0)} ${C}`
            const el = (
              <circle
                key={slice.label}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={slice.tone === "muted" ? "var(--color-muted-foreground)" : TONE_VAR[slice.tone]}
                strokeOpacity={slice.tone === "muted" ? 0.45 : 1}
                strokeWidth="11"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
            offset += length
            return el
          })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight tabular-nums text-foreground">{total.toLocaleString()}</span>
        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">{centerLabel}</span>
      </div>
    </div>
  )
}
