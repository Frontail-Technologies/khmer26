"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState } from "react"
import { Desktop, DeviceMobile, Key, ShieldCheck, SignOut, Trash, Warning } from "@phosphor-icons/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { AccountSession } from "../api/settings.api"
import { useAccountSessions, useAuthenticationMethods, useDeleteAccount, useLogoutOtherSessions, useRevokeAccountSession } from "../api/settings.queries"
import { ChangePasswordDialog } from "./change-password-dialog"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"

export function SecuritySettings() {
  const tGenerated = useTranslations("generated")
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const sessions = useAccountSessions()
  const revoke = useRevokeAccountSession()
  const logoutOthers = useLogoutOtherSessions()
  const deleteAccount = useDeleteAccount()
  const authenticationMethods = useAuthenticationMethods()
  const hasPassword = authenticationMethods.data?.hasPassword === true
  const otherSessionCount = sessions.data?.filter((session) => !session.isCurrent).length ?? 0

  return (
    <>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:p-6">
        <CardHeader className="p-0 pb-5"><div className="flex items-center gap-2 text-primary"><ShieldCheck size={20} weight="fill" /><CardTitle className="text-base font-bold"><LocalizedText id="securitySessions" /></CardTitle></div></CardHeader>
        <CardContent className="space-y-5 p-0">
          {authenticationMethods.isPending ? (
            <Skeleton className="h-20 rounded-xl" />
          ) : hasPassword ? (
            <div className="flex flex-col justify-between gap-3 rounded-xl border bg-muted/40 p-3.5 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><div className="rounded-lg bg-muted p-2 text-muted-foreground"><Key size={18} /></div><p className="text-xs font-bold sm:text-sm"><LocalizedText id="password" /></p></div><Button type="button" variant="outline" size="sm" onClick={() => setChangePasswordOpen(true)}><LocalizedText id="changePassword" /></Button></div>
          ) : null}
          <div className="space-y-3">
            <div className="flex items-center justify-between"><p className="text-xs font-bold"><LocalizedText id="activeSessions" /></p>{otherSessionCount > 0 && <Button type="button" variant="outline" size="xs" disabled={logoutOthers.isPending} onClick={() => logoutOthers.mutate()}><SignOut size={14} /><LocalizedText id="signOutOtherSessions" /></Button>}</div>
            {sessions.isLoading ? <><Skeleton className="h-16" /><Skeleton className="h-16" /></> : sessions.isError ? <div className="rounded-lg border p-4 text-xs text-destructive"><LocalizedText id="sessionsCouldNotBeLoaded" /> <button className="font-bold underline" onClick={() => sessions.refetch()}><LocalizedText id="tryAgain" /></button></div> : sessions.data?.map((session) => <SessionRow key={session.id} session={session} isRevoking={revoke.isPending && revoke.variables === session.id} onRevoke={() => revoke.mutate(session.id)} />)}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 shadow-2xs sm:p-6">
        <CardHeader className="p-0 pb-4"><div className="flex items-center gap-2 text-destructive"><Warning size={20} weight="bold" /><CardTitle className="text-base font-bold"><LocalizedText id="dangerZone" /></CardTitle></div></CardHeader>
        <CardContent className="flex flex-col justify-between gap-3 p-0 sm:flex-row sm:items-center"><div><p className="text-xs font-bold"><LocalizedText id="deleteAccount" /></p><p className="text-xs text-muted-foreground"><LocalizedText id="thisActionCannotBeUndone" /></p></div><Button type="button" variant="destructive" size="sm" onClick={() => setDeleteAccountOpen(true)}><Trash size={16} /><LocalizedText id="deleteAccount" /></Button></CardContent>
      </Card>

      {hasPassword && <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />}
      <Dialog open={deleteAccountOpen} onOpenChange={(open) => { setDeleteAccountOpen(open); if (!open) setConfirmation("") }}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle><LocalizedText id="deleteAccount_f58423" /></DialogTitle><DialogDescription><LocalizedText id="thisPermanentlyDeletesYourAccountAndAccountOwnedData" /></DialogDescription></DialogHeader><Input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={tGenerated("delete")} autoComplete="off" /><DialogFooter><Button type="button" variant="outline" onClick={() => setDeleteAccountOpen(false)}><LocalizedText id="cancel" /></Button><Button type="button" variant="destructive" disabled={confirmation !== "DELETE" || deleteAccount.isPending} onClick={() => deleteAccount.mutate()}>{deleteAccount.isPending && <Loader2 size={16} className="animate-spin" />}{tGenerated("deletePermanently")}</Button></DialogFooter>{deleteAccount.isError && <p role="alert" className="text-xs font-semibold text-destructive">{deleteAccount.error instanceof Error ? deleteAccount.error.message : tGenerated("accountCouldNotBeDeleted")}</p>}</DialogContent>
      </Dialog>
    </>
  )
}

function SessionRow({ session, isRevoking, onRevoke }: { session: AccountSession; isRevoking: boolean; onRevoke: () => void }) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const intlLocale = useIntlLocale()
  const mobile = /mobile|iphone|android/i.test(session.userAgent ?? "")
  const Icon = mobile ? DeviceMobile : Desktop
  const label = describeUserAgent(session.userAgent)
  return <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/40 p-3 text-xs"><div className="flex min-w-0 items-center gap-3"><Icon size={20} className={session.isCurrent ? "shrink-0 text-primary" : "shrink-0 text-muted-foreground"} /><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate font-bold">{label}</p>{session.isCurrent && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-label={tGenerated("currentSession")} />}</div><p className="truncate text-xxs text-muted-foreground">{session.ipAddress || tGenerated("ipUnavailable")} | {session.isCurrent ? tGenerated("activeNow") : tDynamic("lastActive", { date: formatSessionDate(session.lastUsedAt, intlLocale) })}</p></div></div>{!session.isCurrent && <Button type="button" variant="ghost" size="xs" disabled={isRevoking} onClick={onRevoke}>{isRevoking ? <Loader2 size={14} className="animate-spin" /> : <SignOut size={14} />}{tGenerated("signOutAction")}</Button>}</div>
}

function describeUserAgent(value: string | null) {
  if (!value) return "Unknown browser"
  const browser = /Edg\//.test(value) ? "Edge" : /Chrome\//.test(value) ? "Chrome" : /Firefox\//.test(value) ? "Firefox" : /Safari\//.test(value) ? "Safari" : "Browser"
  const system = /Windows/.test(value) ? "Windows" : /iPhone|iPad/.test(value) ? "iOS" : /Android/.test(value) ? "Android" : /Mac OS/.test(value) ? "macOS" : /Linux/.test(value) ? "Linux" : "device"
  return `${browser} on ${system}`
}

function formatSessionDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}
