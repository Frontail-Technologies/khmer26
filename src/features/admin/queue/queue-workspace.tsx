"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Eye, Flag, ImageSquare, SealCheck, Storefront, type Icon } from "@phosphor-icons/react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/shared/status-badge"
import { cn } from "@/lib/utils"
import { useAdminListings } from "../listings/hooks/listings.queries"
import { ListingRowActions } from "../listings/components/listing-row-actions"
import { useAdminVerifications } from "../verifications/hooks/verifications.queries"
import { useAdminReports } from "../reports/hooks/reports.queries"
import { ReportRowActions } from "../reports/components/report-row-actions"
import type { AdminListing } from "../listings/types"
import type { VerificationRequest } from "../verifications/types"
import type { AdminReport } from "../reports/types"

type Kind = "listing" | "verification" | "report"
type Filter = "all" | Kind

type QueueItem =
  | { kind: "listing"; id: string; at: number; listing: AdminListing }
  | { kind: "verification"; id: string; at: number; request: VerificationRequest }
  | { kind: "report"; id: string; at: number; report: AdminReport }

const KIND_META: Record<Kind, { label: string; icon: Icon }> = {
  listing: { label: "Listings", icon: Storefront },
  verification: { label: "Verifications", icon: SealCheck },
  report: { label: "Reports", icon: Flag },
}

const timeAgo = (at: number) => {
  const minutes = Math.max(1, Math.round((Date.now() - at) / 60_000))
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  return hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`
}

const money = (listing: AdminListing) =>
  listing.currency === "USD" ? `$${listing.price.toLocaleString("en-US")}` : `${listing.price.toLocaleString("en-US")} ៛`

function KindIcon({ kind }: { kind: Kind }) {
  const KindGlyph = KIND_META[kind].icon
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl",
        kind === "report" ? "bg-destructive/10 text-destructive" : kind === "verification" ? "bg-primary/10 text-primary" : "bg-accent/12 text-accent"
      )}
    >
      <KindGlyph size={20} weight="fill" />
    </span>
  )
}

/** Listing photo, or the listing icon when there is none or it fails to load. */
function ListingThumb({ url }: { url?: string }) {
  const [failed, setFailed] = useState(false)
  if (!url || failed) {
    return (
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent">
        <ImageSquare size={20} weight="fill" />
      </span>
    )
  }
  return (
    <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-muted">
      <Image src={url} alt="" fill sizes="44px" className="object-cover" onError={() => setFailed(true)} />
    </span>
  )
}

function QueueRow({ item }: { item: QueueItem }) {
  if (item.kind === "listing") {
    const { listing } = item
    const cover = listing.images.find((image) => image.isPrimary) ?? listing.images[0]
    return (
      <li className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <Link href={`/listings/${listing.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <ListingThumb url={cover?.url} />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-foreground">{listing.title}</span>
              <StatusBadge label={listing.status} size="sm" className="shrink-0" />
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{money(listing)}</span> · {listing.seller.name} · {timeAgo(item.at)}
            </span>
          </span>
        </Link>
        <div className="sm:w-60 sm:shrink-0">
          <ListingRowActions listing={listing} layout="card" />
        </div>
      </li>
    )
  }

  if (item.kind === "verification") {
    const { request } = item
    return (
      <li className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <Link href={`/verifications/${request.id}`} className="flex min-w-0 flex-1 items-center gap-3">
          <KindIcon kind="verification" />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-foreground">{request.seller.name}</span>
              <StatusBadge label={request.status} size="sm" className="shrink-0" />
            </span>
            <span className="block truncate text-xs capitalize text-muted-foreground">
              {request.type} · {request.documents.length} docs · {timeAgo(item.at)}
            </span>
          </span>
        </Link>
        <div className="sm:w-60 sm:shrink-0">
          <Link
            href={`/verifications/${request.id}`}
            className="pressable flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-accent text-xs font-bold text-accent-foreground"
          >
            <Eye size={15} />
            Review documents
          </Link>
        </div>
      </li>
    )
  }

  const { report } = item
  return (
    <li className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <Link href={`/reports/${report.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <KindIcon kind="report" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{report.reasonLabel}</span>
            <StatusBadge label={report.status} size="sm" className="shrink-0" />
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {report.target.title} · {report.reporter.name} · {timeAgo(item.at)}
          </span>
        </span>
      </Link>
      <div className="sm:w-60 sm:shrink-0">
        <ReportRowActions report={report} layout="card" />
      </div>
    </li>
  )
}

/**
 * Everything waiting on an admin decision, oldest first, with the decision buttons on each row.
 * Approve/resolve here and the item drops out; an empty queue means the day's work is done.
 */
export function QueueWorkspace() {
  const requested = useSearchParams().get("type")
  const [filter, setFilter] = useState<Filter>(
    requested === "listing" || requested === "verification" || requested === "report" ? requested : "all"
  )
  const listings = useAdminListings({ page: 1, limit: 100, sort: "oldest" })
  const verifications = useAdminVerifications({ page: 1, limit: 100 })
  const reports = useAdminReports({ page: 1, limit: 100 })
  const loading = listings.isLoading || verifications.isLoading || reports.isLoading

  const items = useMemo<QueueItem[]>(() => {
    const all: QueueItem[] = [
      ...(listings.data?.items ?? [])
        .filter((listing) => listing.status === "pending" || listing.status === "flagged")
        .map((listing) => ({ kind: "listing" as const, id: listing.id, at: Date.parse(listing.createdAt), listing })),
      ...(verifications.data?.items ?? [])
        .filter((request) => request.status === "pending" || request.status === "in_review")
        .map((request) => ({ kind: "verification" as const, id: request.id, at: Date.parse(request.submittedAt), request })),
      ...(reports.data?.items ?? [])
        .filter((report) => report.status === "open" || report.status === "in_review")
        .map((report) => ({ kind: "report" as const, id: report.id, at: Date.parse(report.createdAt), report })),
    ]
    // Oldest first: whoever has waited longest gets a decision first.
    return all.sort((a, b) => (a.at || 0) - (b.at || 0))
  }, [listings.data?.items, verifications.data?.items, reports.data?.items])

  const counts = {
    all: items.length,
    listing: items.filter((item) => item.kind === "listing").length,
    verification: items.filter((item) => item.kind === "verification").length,
    report: items.filter((item) => item.kind === "report").length,
  }
  const visible = filter === "all" ? items : items.filter((item) => item.kind === filter)

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="scroll-rail -mx-1 flex gap-2 px-1" role="tablist" aria-label="Queue filter">
        {(["all", "listing", "verification", "report"] as const).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "pressable inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition-colors",
              filter === key ? "border-primary/40 bg-primary/10 text-primary" : "border-border/70 bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {key === "all" ? "All" : KIND_META[key].label}
            <span
              className={cn(
                "min-w-5 rounded-full px-1.5 py-px text-center text-2xs font-bold tabular-nums",
                counts[key] > 0 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs">
        {loading ? (
          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4">
                <Skeleton className="size-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
              <CheckCircle size={30} weight="fill" />
            </span>
            <p className="text-base font-bold text-foreground">All clear</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {visible.map((item) => (
              <QueueRow key={`${item.kind}:${item.id}`} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
