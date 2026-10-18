"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, type FormEvent } from "react"
import { CheckCircle, Lock } from "@phosphor-icons/react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PasswordField } from "@/features/auth/components/password-field"
import { useChangePassword } from "../api/settings.queries"

export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const tGenerated = useTranslations("generated")
  const t = useTranslations("ui.account")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const mutation = useChangePassword()

  function close() {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
    mutation.reset()
    onOpenChange(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError("")
    if (newPassword.length < 8) return setError("New password must be at least 8 characters.")
    if (newPassword !== confirmPassword) return setError("New passwords do not match.")
    try {
      await mutation.mutateAsync({ currentPassword, newPassword })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t("passwordChangeFailed"))
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) close() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><Lock size={22} weight="bold" /></div><DialogTitle><LocalizedText id="changePassword" /></DialogTitle><DialogDescription><LocalizedText id="changingYourPasswordSignsOutEveryOtherActiveSession" /></DialogDescription></DialogHeader>
        {mutation.isSuccess ? (
          <div className="space-y-3 py-5 text-center"><CheckCircle size={42} weight="fill" className="mx-auto text-primary" /><p className="font-bold"><LocalizedText id="passwordUpdated" /></p><p className="text-xs text-muted-foreground"><LocalizedText id="yourCurrentSessionRemainsActive" /></p><Button className="w-full" onClick={close}><LocalizedText id="done" /></Button></div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <PasswordField id="current-password" label={t("passwordCurrent")} placeholder={tGenerated("enterYourCurrentPassword")} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />
            <PasswordField id="new-password" label={t("passwordNew")} placeholder={tGenerated("atLeast8Characters")} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />
            <PasswordField id="confirm-password" label={t("passwordConfirm")} placeholder={tGenerated("reEnterYourNewPassword")} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
            {error && <p role="alert" className="text-xs font-semibold text-destructive">{error}</p>}
            <DialogFooter><Button type="button" variant="outline" onClick={close}><LocalizedText id="cancel" /></Button><Button type="submit" disabled={mutation.isPending || !currentPassword || !newPassword || !confirmPassword}>{mutation.isPending && <Loader2 size={16} className="animate-spin" />}{mutation.isPending ? tGenerated("updating") : tGenerated("updatePassword")}</Button></DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
