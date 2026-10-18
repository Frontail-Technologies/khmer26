"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { Bell, Check, SpinnerGap } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { notificationHref } from "../api/notifications.api"
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadNotificationCount } from "../api/notifications.queries"
import { useNotificationSocket } from "../hooks/use-notification-socket"
import { NotificationItem } from "./notification-item"

export function NotificationBell({ enableSocket = true }: { enableSocket?: boolean }) {
  const tGenerated = useTranslations("generated")
  const router = useRouter()
  const { isAuthenticated } = useCurrentUser()
  const recent = useNotifications(1, false, 5, isAuthenticated)
  const unread = useUnreadNotificationCount(isAuthenticated)
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  useNotificationSocket(isAuthenticated && enableSocket)

  if (!isAuthenticated) return null
  const count = unread.data ?? 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
        aria-label={count ? `Notifications, ${count} unread` : tGenerated("notifications")}
      >
        <Bell size={20} weight={count ? "fill" : "regular"} />
        {count > 0 && <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-3xs font-bold leading-none text-white">{count > 99 ? "99+" : count}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(23rem,calc(100vw-1rem))] p-0">
        <div className="flex h-12 items-center justify-between px-3">
          <DropdownMenuLabel className="p-0 text-sm"><LocalizedText id="notifications" /></DropdownMenuLabel>
          {count > 0 && <Button type="button" variant="ghost" size="xs" disabled={markAll.isPending} onClick={(event) => { event.preventDefault(); markAll.mutate(undefined) }} className="gap-1 text-xxs"><Check size={13} /><LocalizedText id="markAllRead" /></Button>}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-96 divide-y divide-border/60 overflow-y-auto">
          {recent.isPending ? (
            <div className="flex h-28 items-center justify-center text-muted-foreground"><SpinnerGap size={20} className="animate-spin" /></div>
          ) : recent.data?.items.length ? recent.data.items.map((notification) => (
            <NotificationItem key={notification.id} compact notification={notification} onOpen={() => {
              if (!notification.readAt) markRead.mutate(notification.id)
              router.push(notificationHref(notification))
            }} />
          )) : (
            <div className="px-4 py-10 text-center text-xs text-muted-foreground"><LocalizedText id="youAreAllCaughtUp" /></div>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <Button type="button" variant="ghost" onClick={() => router.push("/account/notifications")} className="h-11 w-full rounded-none text-xs font-semibold"><LocalizedText id="viewAllNotifications" /></Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
