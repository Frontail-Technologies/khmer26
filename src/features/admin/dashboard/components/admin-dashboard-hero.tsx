"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  CaretRight,
  ChatCircleDots,
  CheckCircle,
  CurrencyDollar,
  Flag,
  Hourglass,
  SealCheck,
  Storefront,
  UsersThree,
  WarningOctagon,
  type Icon,
} from "@phosphor-icons/react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { AdminDailyTrend } from "../api/dashboard.api"
import { useAdminDashboard } from "../hooks/dashboard.queries"
import { AreaChart, Donut, Sparkline, TONE_VAR, type ChartTone, type DonutSlice } from "./dashboard-charts"

type SeriesKey = "listings" | "users" | "revenue" | "messages"

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { maximumFractionDigits: value >= 1000 ? 0 : 2 })}`
const count = (value: number) => value.toLocaleString("en-US")
const dayLabel = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

/** Last 7 days vs the 7 before, as a percentage (null when there is nothing to compare). */
function weekOverWeek(trends: AdminDailyTrend[], key: SeriesKey): number | null {
  const sum = (rows: AdminDailyTrend[]) => rows.reduce((total, row) => total + row[key], 0)
  const current = sum(trends.slice(-7))
  const previous = sum(trends.slice(-14, -7))
  if (previous === 0) return current > 0 ? 100 : null
  return Math.round(((current - previous) / previous) * 100)
}

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-2xs font-semibold text-muted-foreground">—</span>
  const up = value >= 0
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-2xs font-bold tabular-nums",
        up ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive"
      )}
    >
      <DeltaIcon size={11} weight="bold" />
      {Math.abs(value)}%
    </span>
  )
}

interface KpiCardProps {
  href: string
  label: string
  value: string
  icon: Icon
  tone: ChartTone
  series: number[]
  delta: number | null
}

function KpiCard({ href, label, value, icon: KpiIcon, tone, series, delta }: KpiCardProps) {
  return (
    <Link
      href={href}
      className="pressable group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-3.5 shadow-2xs transition-shadow hover:shadow-md sm:p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="flex size-8 items-center justify-center rounded-xl sm:size-9"
          style={{ background: `color-mix(in oklab, ${TONE_VAR[tone]} 14%, transparent)`, color: TONE_VAR[tone] }}
        >
          <KpiIcon size={17} weight="fill" />
        </span>
        <Delta value={delta} />
      </div>
      <span className="mt-3 truncate text-xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-2xl">{value}</span>
      <span className="truncate text-2xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-xxs">{label}</span>
      <Sparkline values={series} tone={tone} className="mt-2.5 -mb-1" />
    </Link>
  )
}

interface AttentionTileProps {
  href: string
  label: string
  value: number
  icon: Icon
  tone: ChartTone
}

function AttentionTile({ href, label, value, icon: TileIcon, tone }: AttentionTileProps) {
  const clear = value === 0
  return (
    <Link
      href={href}
      className={cn(
        "pressable flex items-center gap-3 rounded-2xl border p-3 transition-colors sm:p-3.5",
        clear ? "border-border/60 bg-card" : "border-transparent"
      )}
      style={clear ? undefined : { background: `color-mix(in oklab, ${TONE_VAR[tone]} 10%, var(--color-card))` }}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: clear ? "var(--color-muted)" : TONE_VAR[tone],
          color: clear ? "var(--color-muted-foreground)" : "white",
        }}
      >
        {clear ? <CheckCircle size={18} weight="fill" /> : <TileIcon size={18} weight="fill" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-extrabold leading-tight tabular-nums text-foreground">{value}</span>
        <span className="block truncate text-xxs font-semibold text-muted-foreground">{label}</span>
      </span>
      <CaretRight size={14} weight="bold" className="shrink-0 text-muted-foreground/60" />
    </Link>
  )
}

const SERIES: Array<{ key: SeriesKey; label: string; tone: ChartTone; format: (v: number) => string }> = [
  { key: "listings", label: "Listings", tone: "primary", format: count },
  { key: "users", label: "Users", tone: "success", format: count },
  { key: "revenue", label: "Revenue", tone: "accent", format: money },
  { key: "messages", label: "Messages", tone: "info", format: count },
]

/** Top of the admin dashboard: trend KPIs, activity chart, listing mix and the work queue. */
export function AdminDashboardHero() {
  const { data, isPending } = useAdminDashboard()
  const [seriesKey, setSeriesKey] = useState<SeriesKey>("listings")
  const trends = useMemo(() => data?.trends ?? [], [data?.trends])
  const labels = useMemo(() => trends.map((row) => dayLabel(row.day)), [trends])
  const series = (key: SeriesKey) => trends.map((row) => row[key])
  const selected = SERIES.find((item) => item.key === seriesKey) ?? SERIES[0]!

  if (isPending) {
    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    )
  }

  const listings = data?.listings
  const slices: DonutSlice[] = [
    { label: "Active", value: listings?.active ?? 0, tone: "success" },
    { label: "Pending", value: listings?.pendingReview ?? 0, tone: "warning" },
    { label: "Flagged", value: listings?.flagged ?? 0, tone: "destructive" },
    { label: "Sold", value: listings?.sold ?? 0, tone: "primary" },
    { label: "Expired", value: listings?.expired ?? 0, tone: "muted" },
    { label: "Rejected", value: listings?.rejected ?? 0, tone: "accent" },
  ]
  const sliceTotal = slices.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        <KpiCard href="/listings" label="Listings" value={count(listings?.total ?? 0)} icon={Storefront} tone="primary" series={series("listings")} delta={weekOverWeek(trends, "listings")} />
        <KpiCard href="/users" label="Users" value={count(data?.users?.total ?? 0)} icon={UsersThree} tone="success" series={series("users")} delta={weekOverWeek(trends, "users")} />
        <KpiCard href="/payments" label="Revenue · 30d" value={money(data?.revenue?.last30Days ?? 0)} icon={CurrencyDollar} tone="accent" series={series("revenue")} delta={weekOverWeek(trends, "revenue")} />
        <KpiCard href="/chats" label="Messages today" value={count(data?.chat?.messagesToday ?? 0)} icon={ChatCircleDots} tone="info" series={series("messages")} delta={weekOverWeek(trends, "messages")} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        <AttentionTile href="/listings" label="Pending review" value={listings?.pendingReview ?? 0} icon={Hourglass} tone="warning" />
        <AttentionTile href="/listings" label="Flagged" value={listings?.flagged ?? 0} icon={WarningOctagon} tone="destructive" />
        <AttentionTile href="/verifications" label="Verifications" value={data?.sellers?.pendingVerification ?? 0} icon={SealCheck} tone="primary" />
        <AttentionTile href="/reports" label="Open reports" value={data?.reports?.open ?? 0} icon={Flag} tone="destructive" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-2xs sm:p-5 lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-foreground">Last 30 days</h2>
            <div className="scroll-rail -mx-1 flex gap-1 rounded-full bg-muted/70 p-1" role="tablist">
              {SERIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={seriesKey === item.key}
                  onClick={() => setSeriesKey(item.key)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all",
                    seriesKey === item.key ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <AreaChart labels={labels} values={series(selected.key)} tone={selected.tone} formatValue={selected.format} />
        </section>

        <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-2xs sm:p-5 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Listing status</h2>
            <Link href="/listings" className="text-xs font-semibold text-primary">
              View
            </Link>
          </div>
          <Donut slices={slices} centerLabel="Listings" />
          <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {slices.map((slice) => (
              <li key={slice.label} className="flex items-center gap-2 text-xs">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{
                    background: slice.tone === "muted" ? "var(--color-muted-foreground)" : TONE_VAR[slice.tone],
                    opacity: slice.tone === "muted" ? 0.45 : 1,
                  }}
                />
                <span className="flex-1 truncate text-muted-foreground">{slice.label}</span>
                <span className="font-bold tabular-nums text-foreground">{slice.value}</span>
                <span className="w-8 text-right text-2xs tabular-nums text-muted-foreground">
                  {sliceTotal ? Math.round((slice.value / sliceTotal) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
