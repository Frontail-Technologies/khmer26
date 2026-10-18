"use client"

import { useTranslations } from "next-intl"

import {
  Bell, ChatCircleDots, CheckCircle, Clock, Crown, Megaphone, Star, Tag, WarningCircle,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"
import type { CustomerNotification, NotificationType } from "../api/notifications.api"

const ICONS: Partial<Record<NotificationType, typeof Bell>> = {
  chat_message: ChatCircleDots,
  offer_received: Tag,
  offer_accepted: CheckCircle,
  offer_rejected: WarningCircle,
  offer_countered: Tag,
  offer_withdrawn: Tag,
  listing_approved: CheckCircle,
  listing_rejected: WarningCircle,
  listing_expiring: Clock,
  listing_expired: Clock,
  subscription_expiring: Crown,
  subscription_expired: Crown,
  promotion_expiring: Megaphone,
  listing_favorited: CheckCircle,
  saved_search_match: Bell,
  verification_updated: CheckCircle,
  review_available: Star,
  system: Bell,
}

export function formatNotificationTime(value: string): string {
  const date = new Date(value)
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second")
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute")
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour")
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 7) return formatter.format(days, "day")
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric" })
}

interface NotificationItemProps {
  notification: CustomerNotification
  compact?: boolean
  onOpen: () => void
}

export function NotificationItem({ notification, compact = false, onOpen }: NotificationItemProps) {
  const localized = useLocalizedText()
  const tGenerated = useTranslations("generated")
  const Icon = ICONS[notification.type] ?? Bell
  const unread = !notification.readAt

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "relative flex w-full items-start gap-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        compact ? "px-3 py-3" : "px-4 py-4 sm:px-5",
        unread && "bg-primary/5"
      )}
    >
      <span className={cn("mt-0.5 flex shrink-0 items-center justify-center rounded-full", compact ? "size-8" : "size-10", unread ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground")}>
        <Icon size={compact ? 16 : 19} weight={unread ? "fill" : "regular"} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-foreground", compact ? "text-xs" : "text-sm", unread ? "font-bold" : "font-semibold")}>{localized(notification.title, notification.titleKm)}</span>
        <span className={cn("mt-0.5 block text-muted-foreground", compact ? "line-clamp-2 text-xxs" : "text-xs leading-relaxed")}>{localized(notification.body, notification.bodyKm)}</span>
        <span className="mt-1.5 block text-2xs font-medium text-muted-foreground">{formatNotificationTime(notification.createdAt)}</span>
      </span>
      {unread && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label={tGenerated("unread")} />}
    </button>
  )
}
