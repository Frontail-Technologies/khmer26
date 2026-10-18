"use client"

import Link from "next/link"
import {
  ArrowSquareOut,
  ChatCircleDots,
  ClockCounterClockwise,
  ListBullets,
  Receipt,
  WarningOctagon,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { formatAdminDateTime } from "@/lib/formatters/date"
import { useAdminListings } from "@/features/admin/listings/hooks/listings.queries"
import { useAdminChatConversations } from "@/features/admin/chats/hooks/chats.queries"
import { useAdminPayments } from "@/features/admin/payments/hooks/payments.queries"
import type { AdminChatParticipant } from "@/features/admin/chats/types"
import type { AdminUserDetail } from "../types"

function toneForStatus(status: string): StatusTone {
  if (["active", "approved", "successful", "resolved"].includes(status)) return "success"
  if (["failed", "rejected", "suspended", "cancelled"].includes(status)) return "destructive"
  if (["pending", "pending_review", "open", "expired"].includes(status)) return "warning"
  return "neutral"
}

function EmptyRows({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-2 text-muted-foreground">
      {icon}
      <p className="text-xs font-medium">{label}</p>
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-3 p-5" aria-label="Loading" aria-busy="true">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

export function UserListingsTab({ user }: { user: AdminUserDetail }) {
  const query = useAdminListings({ sellerId: user.id, page: 1, limit: 20, sort: "newest" })

  return (
    <Card className="overflow-hidden rounded-t-none border-0 bg-card p-0 shadow-2xs">
      {query.isPending ? <LoadingRows /> : query.data?.items.length ? (
        <div className="divide-y divide-border/60">
          {query.data.items.map((listing) => (
            <Link
              key={listing.id}
              href={`/admin/listings/${listing.id}`}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_9rem_7rem_8rem_auto]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
                <p className="truncate text-xs text-muted-foreground">{listing.categoryName}</p>
              </div>
              <span className="hidden text-xs font-semibold text-foreground sm:block">
                {listing.currency} {listing.price.toLocaleString()}
              </span>
              <span className="hidden sm:block"><StatusBadge label={listing.status} tone={toneForStatus(listing.status)} size="sm" /></span>
              <span className="hidden text-xs text-muted-foreground sm:block">{formatAdminDateTime(listing.createdAt)}</span>
              <ArrowSquareOut size={16} className="text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyRows icon={<ListBullets size={28} />} label="No listings found" />
      )}
    </Card>
  )
}

export function UserConversationsTab({ user }: { user: AdminUserDetail }) {
  const participant: AdminChatParticipant = {
    id: user.id,
    name: user.name,
    businessName: user.businessName,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
  }
  const query = useAdminChatConversations(user.id, participant)

  return (
    <Card className="overflow-hidden rounded-t-none border-0 bg-card p-0 shadow-2xs">
      {query.isPending ? <LoadingRows /> : query.data?.length ? (
        <div className="divide-y divide-border/60">
          {query.data.map((conversation) => {
            const other = conversation.participantA.id === user.id
              ? conversation.participantB
              : conversation.participantA
            return (
              <Link
                key={conversation.id}
                href={`/admin/chats?user=${encodeURIComponent(user.id)}&conversation=${encodeURIComponent(conversation.id)}`}
                className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[9rem_minmax(0,1fr)_12rem_8rem_auto]"
              >
                <span className="hidden text-xs font-bold text-primary sm:block">{conversation.displayId}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{other.businessName || other.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{conversation.lastMessage}</p>
                </div>
                <span className="hidden truncate text-xs text-muted-foreground sm:block">{conversation.listing?.title || "No listing"}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{formatAdminDateTime(conversation.lastMessageAt)}</span>
                <ArrowSquareOut size={16} className="text-muted-foreground" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyRows icon={<ChatCircleDots size={28} />} label="No conversations found" />
      )}
    </Card>
  )
}

export function UserReportsTab({ user }: { user: AdminUserDetail }) {
  return (
    <Card className="overflow-hidden rounded-t-none border-0 bg-card p-0 shadow-2xs">
      {user.relatedReports.length ? (
        <div className="divide-y divide-border/60">
          {user.relatedReports.map((report) => (
            <Link
              key={report.id}
              href={`/admin/reports/${report.id}`}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_12rem_8rem_8rem_auto]"
            >
              <p className="truncate text-sm font-semibold text-foreground">{report.reason}</p>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">{report.reporterName}</span>
              <span className="hidden sm:block"><StatusBadge label={report.status} tone={toneForStatus(report.status)} size="sm" /></span>
              <span className="hidden text-xs text-muted-foreground sm:block">{formatAdminDateTime(report.createdAt)}</span>
              <ArrowSquareOut size={16} className="text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyRows icon={<WarningOctagon size={28} />} label="No reports found" />
      )}
    </Card>
  )
}

export function UserBillingTab({ user }: { user: AdminUserDetail }) {
  const query = useAdminPayments({ userId: user.id, page: 1, limit: 20 })

  return (
    <Card className="overflow-hidden rounded-t-none border-0 bg-card p-0 shadow-2xs">
      {query.isPending ? <LoadingRows /> : query.data?.items.length ? (
        <div className="divide-y divide-border/60">
          {query.data.items.map((payment) => (
            <Link
              key={payment.id}
              href={`/admin/payments?search=${encodeURIComponent(payment.displayId)}`}
              className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-[10rem_minmax(0,1fr)_8rem_8rem_8rem_auto]"
            >
              <span className="hidden text-xs font-bold text-primary sm:block">{payment.displayId}</span>
              <p className="truncate text-sm font-semibold text-foreground">{payment.purposeTitle}</p>
              <span className="hidden text-xs font-semibold text-foreground sm:block">{payment.amount.toLocaleString()} {payment.currency}</span>
              <span className="hidden sm:block"><StatusBadge label={payment.status} tone={toneForStatus(payment.status)} size="sm" /></span>
              <span className="hidden text-xs text-muted-foreground sm:block">{payment.createdAt}</span>
              <ArrowSquareOut size={16} className="text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyRows icon={<Receipt size={28} />} label="No payments found" />
      )}
    </Card>
  )
}

export function UserActivityTab({ user }: { user: AdminUserDetail }) {
  return (
    <Card className="overflow-hidden rounded-t-none border-0 bg-card p-0 shadow-2xs">
      {user.accountHistory.length ? (
        <div className="divide-y divide-border/60">
          {user.accountHistory.map((event) => (
            <div key={event.id} className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-5 py-3 sm:grid-cols-[auto_minmax(0,1fr)_12rem_8rem]">
              <ClockCounterClockwise size={17} className="mt-0.5 text-primary" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{event.action}</p>
                {event.note && <p className="truncate text-xs text-muted-foreground">{event.note}</p>}
              </div>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">{event.actor}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{formatAdminDateTime(event.timestamp)}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyRows icon={<ClockCounterClockwise size={28} />} label="No activity found" />
      )}
    </Card>
  )
}
