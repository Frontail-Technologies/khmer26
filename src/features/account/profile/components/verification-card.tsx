"use client"

import { useTranslations } from "next-intl"

import { LocalizedText } from "@/components/i18n/localized-text"

import { useRef, useState, type FormEvent } from "react"
import { ArrowClockwise, CheckCircle, EnvelopeSimple, IdentificationCard, ShieldCheck, Trash, UploadSimple, WarningCircle, XCircle } from "@phosphor-icons/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { uploadMediaFile, validateImageFile } from "@/lib/api/media"
import { useMyVerification, useSubmitVerification } from "../api/profile.queries"
import type { AccountProfile, SellerType } from "../api/profile.api"
import { useIntlLocale } from "@/lib/i18n/use-intl-locale"

export function VerificationCard({ account }: { account: AccountProfile }) {
  const tGenerated = useTranslations("generated")
  const tDynamic = useTranslations("dynamic")
  const t = useTranslations("ui.account")
  const intlLocale = useIntlLocale()
  const profile = account.sellerProfile
  const verification = useMyVerification(Boolean(profile))
  const submit = useSubmitVerification()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [documents, setDocuments] = useState<PendingDocument[]>([])
  const [rejections, setRejections] = useState<string[]>([])
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false)
  const [legalName, setLegalName] = useState(profile?.fullName ?? "")
  const [type, setType] = useState<SellerType>(profile?.sellerType ?? "individual")
  const [notes, setNotes] = useState("")
  const state = verification.data
  const isActive = state?.status === "pending" || state?.status === "in_review"

  function addDocuments(fileList: FileList) {
    const incoming = Array.from(fileList)
    const accepted: PendingDocument[] = []
    const issues: string[] = []
    const slots = Math.max(0, 3 - documents.length)

    for (const file of incoming) {
      const invalid = validateImageFile(file)
      if (invalid) issues.push(invalid.message)
      else if (accepted.length >= slots) issues.push(`${file.name}: you can add up to 3 documents.`)
      else accepted.push({ id: `${file.name}-${file.size}-${Date.now()}-${accepted.length}`, file, progress: 0, status: "ready" })
    }

    setDocuments((current) => [...current, ...accepted])
    setRejections(issues)
  }

  async function uploadDocument(document: PendingDocument) {
    setDocuments((current) => current.map((item) => item.id === document.id
      ? { ...item, status: "uploading", progress: 0, error: undefined }
      : item))
    try {
      const uploaded = await uploadMediaFile(document.file, "verification_document", {
        onProgress: (progress) => setDocuments((current) => current.map((item) =>
          item.id === document.id ? { ...item, progress } : item
        )),
      })
      setDocuments((current) => current.map((item) => item.id === document.id
        ? { ...item, status: "done", progress: 100, mediaId: uploaded.mediaId }
        : item))
      return uploaded.mediaId
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed. Please try again."
      setDocuments((current) => current.map((item) => item.id === document.id
        ? { ...item, status: "error", error: message }
        : item))
      throw new Error(message)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!legalName.trim()) {
      toast.error(tGenerated("enterTheLegalNameShownOnTheDocument"))
      return
    }
    if (documents.length === 0 || isUploadingDocuments) {
      toast.error(tGenerated("addAtLeastOneDocumentBeforeSubmitting"))
      return
    }
    try {
      setIsUploadingDocuments(true)
      const mediaIds: string[] = []
      for (const document of documents) {
        if (document.mediaId) mediaIds.push(document.mediaId)
        else mediaIds.push(await uploadDocument(document))
      }
      await submit.mutateAsync({
        verificationType: type,
        legalName: legalName.trim(),
        notes: notes.trim() || undefined,
        mediaIds,
      })
      setDocuments([])
      setNotes("")
      setIsOpen(false)
      toast.success(tGenerated("verificationSubmittedForReview"))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tGenerated("verificationCouldNotBeSubmitted"))
    } finally {
      setIsUploadingDocuments(false)
    }
  }

  const statusLabel = !profile
    ? tGenerated("profileRequired")
    : verification.isLoading
      ? tGenerated("checking")
      : state?.status === "approved"
        ? t("verified")
        : state?.status === "pending"
          ? t("pendingReview")
          : state?.status === "in_review"
            ? t("inReview")
            : state?.status === "rejected"
              ? t("actionRequired")
              : t("notVerified")

  return (
    <>
      <Card className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs sm:p-5">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center gap-1.5 text-primary">
            <ShieldCheck size={18} weight="fill" />
            <CardTitle className="text-sm font-bold text-foreground sm:text-base"><LocalizedText id="accountVerification" /></CardTitle>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-border/60 p-0">
          <VerificationRow icon={<EnvelopeSimple size={16} />} title={tGenerated("email")} value={account.user.email ?? t("noEmail")} verified={Boolean(account.user.emailVerifiedAt)} />
          <div className="space-y-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <IdentificationCard size={16} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0"><p className="text-xs font-semibold"><LocalizedText id="nationalIdPassport" /></p><p className="truncate text-xxs text-muted-foreground">{statusLabel}</p></div>
              </div>
              {state?.isVerified ? (
                <Badge variant="outline" className="shrink-0 border-primary/20 bg-primary/10 text-2xs font-bold text-primary"><CheckCircle size={12} weight="fill" /> <LocalizedText id="verified" /></Badge>
              ) : (
                <Button type="button" size="xs" className="h-8 shrink-0" disabled={!profile || isActive || verification.isLoading} onClick={() => setIsOpen(true)}>
                  {state?.status === "rejected" ? tGenerated("resubmit") : isActive ? tGenerated("submitted") : tGenerated("verify")}
                </Button>
              )}
            </div>
            {state?.status === "rejected" && state.request?.rejectionReason && (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive">
                <p className="font-bold"><LocalizedText id="reviewFeedback" /></p><p className="mt-1">{state.request.rejectionReason}</p>
              </div>
            )}
            {isActive && (
              <p className="text-xs text-muted-foreground">
                {tDynamic("verificationSubmittedAt", {
                  date: state?.request
                    ? new Intl.DateTimeFormat(intlLocale, { dateStyle: "medium" }).format(new Date(state.request.createdAt))
                    : "",
                })}
              </p>
            )}
            {!profile && <p className="text-xs text-muted-foreground"><LocalizedText id="saveYourSellerProfileBeforeSubmittingIdentityDocuments" /></p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg overflow-x-hidden p-4 sm:p-6">
          <DialogHeader className="min-w-0 pr-8">
            <DialogTitle><LocalizedText id="identityVerification" /></DialogTitle>
            <DialogDescription><LocalizedText id="uploadClearImagesOfAValidGovernmentIdOr" /></DialogDescription>
          </DialogHeader>
          <form className="min-w-0 space-y-4" onSubmit={handleSubmit}>
            <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="min-w-0 space-y-1.5"><label className="text-xs font-bold"><LocalizedText id="verificationType" /></label><Select value={type} onValueChange={(value) => setType(value as SellerType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="individual"><LocalizedText id="individual" /></SelectItem><SelectItem value="business"><LocalizedText id="business" /></SelectItem><SelectItem value="dealer"><LocalizedText id="dealer" /></SelectItem></SelectContent></Select></div>
              <div className="min-w-0 space-y-1.5"><label className="text-xs font-bold"><LocalizedText id="legalName" /></label><Input value={legalName} onChange={(event) => setLegalName(event.target.value)} maxLength={200} required /></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold"><LocalizedText id="documents" /></label>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => { if (event.target.files) addDocuments(event.target.files); event.currentTarget.value = "" }} />
              <button type="button" disabled={isUploadingDocuments || submit.isPending} onClick={() => fileInputRef.current?.click()} className="flex min-h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center hover:border-primary/60 hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60">
                <UploadSimple size={24} className="mb-2 text-primary" /><span className="text-xs font-bold"><LocalizedText id="chooseDocumentImages" /></span><span className="mt-1 text-xxs text-muted-foreground"><LocalizedText id="filesUploadWhenYouSubmitJpgPngOrWebp" /></span>
              </button>
              {documents.map((item) => (
                <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-lg border p-2.5">
                  <div className="min-w-0 flex-1 overflow-hidden"><p className="truncate text-xs font-semibold" title={item.file.name}>{item.file.name}</p>{item.status !== "ready" && <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full ${item.status === "error" ? "bg-destructive" : "bg-primary"}`} style={{ width: `${item.progress}%` }} /></div>}<p className={`mt-1 wrap-anywhere text-xxs leading-4 ${item.error ? "text-destructive" : "text-muted-foreground"}`}>{item.error ?? (item.status === "ready" ? t("readyToUpload") : item.status === "done" ? t("uploaded") : item.status === "uploading" ? t("uploading") : "")}</p></div>
                  {item.status === "error" && <Button type="button" variant="ghost" size="icon-sm" className="shrink-0" aria-label={tGenerated("retryDocumentUpload")} title={tGenerated("retryUpload")} disabled={isUploadingDocuments} onClick={() => { void uploadDocument(item).catch((error: unknown) => toast.error(error instanceof Error ? error.message : t("uploadFailed"))) }}><ArrowClockwise size={15} /></Button>}
                  <Button type="button" variant="ghost" size="icon-sm" className="shrink-0" aria-label={tGenerated("removeDocument")} title={tGenerated("removeDocument")} disabled={isUploadingDocuments} onClick={() => setDocuments((current) => current.filter((document) => document.id !== item.id))}><Trash size={15} /></Button>
                </div>
              ))}
              {rejections.map((message) => <p key={message} className="flex items-center gap-1 text-xs text-destructive"><WarningCircle size={14} />{message}</p>)}
            </div>
            <div className="space-y-1.5"><label className="text-xs font-bold"><LocalizedText id="notes" /> <span className="font-normal text-muted-foreground"><LocalizedText id="optional" /></span></label><Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} maxLength={1000} placeholder={tGenerated("addInformationThatMayHelpTheReviewer")} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isUploadingDocuments || submit.isPending} onClick={() => setIsOpen(false)}><LocalizedText id="cancel" /></Button>
              <Button type="submit" disabled={submit.isPending || isUploadingDocuments || documents.length === 0}>{(submit.isPending || isUploadingDocuments) && <Loader2 size={16} className="animate-spin" />}{isUploadingDocuments ? tGenerated("uploadingDocuments") : submit.isPending ? t("submitting") : t("submitForReview")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface PendingDocument {
  id: string
  file: File
  progress: number
  status: "ready" | "uploading" | "done" | "error"
  mediaId?: string
  error?: string
}

function VerificationRow({ icon, title, value, verified }: { icon: React.ReactNode; title: string; value: string; verified: boolean }) {
  const tGenerated = useTranslations("generated")
  return <div className="flex items-center justify-between gap-3 py-3 first:pt-0"><div className="flex min-w-0 items-center gap-2 text-muted-foreground">{icon}<div className="min-w-0"><p className="text-xs font-semibold text-foreground">{title}</p><p className="truncate text-xxs">{value}</p></div></div><Badge variant="outline" className={verified ? "shrink-0 border-primary/20 bg-primary/10 text-2xs font-bold text-primary" : "shrink-0 text-2xs text-muted-foreground"}>{verified ? <CheckCircle size={12} weight="fill" /> : <XCircle size={12} />}{verified ? tGenerated("verified") : tGenerated("unverified")}</Badge></div>
}
