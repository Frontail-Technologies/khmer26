"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useState, type FormEvent } from "react"
import { Flag, CheckCircle } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useChatReportReasons, useReportConversation } from "../api/messages.queries"
import type { ConversationParticipant } from "../types"
import { useLocalizedText } from "@/lib/i18n/use-localized-text"

interface ReportUserDialogProps {
  participant: ConversationParticipant
  conversationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportUserDialog({ participant, conversationId, open, onOpenChange }: ReportUserDialogProps) {
  const tGenerated = useTranslations("generated")
  const localized = useLocalizedText()
  const tDynamic = useTranslations("dynamic")
  const [reasonId, setReasonId] = useState("")
  const [details, setDetails] = useState("")
  const reasons = useChatReportReasons(open)
  const report = useReportConversation()

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      report.reset()
      setReasonId("")
      setDetails("")
    }
    onOpenChange(next)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!reasonId) return
    report.mutate({ conversationId, reasonId, details: details.trim() || undefined })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1"><Flag size={22} weight="bold" /></div>
          <DialogTitle className="text-lg font-bold">
            {tDynamic("reportConversationNamed", { name: participant.name })}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground"><LocalizedText id="ourTrustAndSafetyTeamWillReviewThisConversation" /></DialogDescription>
        </DialogHeader>

        {report.isSuccess ? (
          <div className="py-6 text-center space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto"><CheckCircle size={32} weight="fill" /></div>
            <p className="text-sm font-bold text-foreground"><LocalizedText id="reportReceived" /></p>
            <p className="text-xs text-muted-foreground"><LocalizedText id="thankYouForHelpingKeepKhmer26Safe" /></p>
            <Button className="mt-2" onClick={() => handleOpenChange(false)}><LocalizedText id="done" /></Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground"><LocalizedText id="reasonForReport" /></label>
              <Select value={reasonId} onValueChange={(value) => setReasonId(value as string)}>
                <SelectTrigger className="h-10 text-xs bg-background"><SelectValue placeholder={reasons.isPending ? tGenerated("loadingReasons_1755ad") : tGenerated("selectReason")} /></SelectTrigger>
                <SelectContent>{(reasons.data ?? []).map((reason) => <SelectItem key={reason.id} value={reason.id} className="text-xs">{localized(reason.label, reason.labelKm)}</SelectItem>)}</SelectContent>
              </Select>
              {reasons.isError && <p className="text-xs text-destructive"><LocalizedText id="couldNotLoadReportReasons" /></p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground"><LocalizedText id="additionalDetailsOptional" /></label>
              <Textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={2000} placeholder={tGenerated("provideAnyAdditionalContextOrEvidence")} rows={3} className="text-xs bg-background resize-none" />
            </div>
            {report.isError && <p role="alert" className="text-xs text-destructive"><LocalizedText id="theReportCouldNotBeSubmittedPleaseTryAgain" /></p>}
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}><LocalizedText id="cancel" /></Button>
              <Button type="submit" variant="destructive" disabled={!reasonId || report.isPending}>{report.isPending ? tGenerated("submitting_46a1a6") : tGenerated("submitReport")}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
