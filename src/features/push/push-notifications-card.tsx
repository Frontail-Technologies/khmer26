"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { BellRinging, CheckCircle } from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePushNotifications } from "./use-push-notifications"

/** Device-level switch for push notifications; which events notify is controlled by the preferences below it. */
export function PushNotificationsCard({ className }: { className?: string }) {
  const t = useTranslations("pwa")
  const { status, busy, enable, disable } = usePushNotifications()

  if (status === "loading" || status === "unavailable") return null

  const hint =
    status === "blocked"
      ? t("pushBlocked")
      : status === "unsupported"
        ? t("pushUnsupported")
        : status === "ios-install"
          ? t("pushIosInstall")
          : t("pushDescription")

  const handleEnable = async () => {
    try {
      if (await enable()) toast.success(t("pushEnabledToast"))
    } catch {
      toast.error(t("pushFailed"))
    }
  }

  return (
    <Card className={cn("rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs", className)}>
      <CardContent className="flex items-center gap-3 p-0">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            status === "on" ? "bg-success/12 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {status === "on" ? <CheckCircle size={22} weight="fill" /> : <BellRinging size={22} weight="fill" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{t("pushTitle")}</p>
          <p className="text-xs leading-snug text-muted-foreground">{status === "on" ? t("pushOn") : hint}</p>
        </div>
        {status === "off" && (
          <Button size="sm" className="shrink-0 rounded-full px-4 font-bold" disabled={busy} onClick={handleEnable}>
            {t("pushEnable")}
          </Button>
        )}
        {status === "on" && (
          <Button size="sm" variant="outline" className="shrink-0 rounded-full px-4" disabled={busy} onClick={() => void disable()}>
            {t("pushDisable")}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
