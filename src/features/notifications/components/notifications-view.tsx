"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Check, SpinnerGap, WarningCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountPageHeader } from "@/features/account/components/account-page-header"
import { notificationHref } from "../api/notifications.api"
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadNotificationCount } from "../api/notifications.queries"
import { NotificationItem } from "./notification-item"

export function NotificationsView() {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const router = useRouter()
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [page, setPage] = useState(1)
  const notifications = useNotifications(page, unreadOnly)
  const unread = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  const pagination = notifications.data?.pagination

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={tGenerated("notifications")}
        action={(unread.data ?? 0) > 0 ? <Button variant="outline" size="sm" disabled={markAll.isPending} onClick={() => markAll.mutate(undefined)} className="shrink-0 gap-1.5"><Check size={15} /><LocalizedText id="markAllRead" /></Button> : undefined}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card p-3 shadow-xs sm:p-5">
        <Tabs value={unreadOnly ? "unread" : "all"} onValueChange={(value) => { setUnreadOnly(value === "unread"); setPage(1) }}>
          <TabsList variant="line" className="px-4">
            <TabsTrigger value="all"><LocalizedText id="all" /></TabsTrigger>
            <TabsTrigger value="unread">
              {tDynamic("unreadCount", { count: unread.data ?? 0 })}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="min-h-80 divide-y divide-border/60 border-t border-border/60">
          {notifications.isPending ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground"><SpinnerGap size={24} className="animate-spin" /></div>
          ) : notifications.isError ? (
            <div className="flex h-80 flex-col items-center justify-center gap-3 text-center"><WarningCircle size={32} className="text-destructive" /><p className="text-sm font-semibold"><LocalizedText id="couldNotLoadNotifications" /></p><Button variant="outline" size="sm" onClick={() => notifications.refetch()}><LocalizedText id="tryAgain" /></Button></div>
          ) : notifications.data.items.length ? notifications.data.items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} onOpen={() => {
              if (!notification.readAt) markRead.mutate(notification.id)
              router.push(notificationHref(notification))
            }} />
          )) : (
            <div className="flex h-80 flex-col items-center justify-center gap-3 px-5 text-center"><span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><Bell size={26} /></span><div><p className="text-sm font-bold">{unreadOnly ? tGenerated("noUnreadNotifications") : tGenerated("noNotificationsYet")}</p><p className="mt-1 text-xs text-muted-foreground">{unreadOnly ? tGenerated("youAreAllCaughtUp") : tGenerated("updatesFromKhmer26WillAppearHere")}</p></div></div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>{tDynamic("pageOf", { page: pagination.page, totalPages: pagination.totalPages })}</span>
            <div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><LocalizedText id="previous" /></Button><Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)}><LocalizedText id="next" /></Button></div>
          </div>
        )}
      </div>
    </div>
  )
}
