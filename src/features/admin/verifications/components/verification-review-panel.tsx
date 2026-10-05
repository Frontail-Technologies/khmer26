"use client"

import { useState } from "react"
import { ShieldCheck, XCircle, CheckCircle } from "@phosphor-icons/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ApproveVerificationDialog } from "./approve-verification-dialog"
import { RejectVerificationDialog } from "./reject-verification-dialog"
import { useApproveVerification, useRejectVerification } from "../hooks/verifications.mutations"
import type { VerificationRequest, VerificationStatus } from "../types"

interface VerificationReviewPanelProps {
  request: VerificationRequest
}

const STATUS_TONE_MAP: Record<VerificationStatus, StatusTone> = {
  pending: "warning",
  in_review: "info",
  approved: "success",
  rejected: "destructive",
}

const STATUS_LABEL_MAP: Record<VerificationStatus, string> = {
  pending: "Pending Review",
  in_review: "In Review",
  approved: "Approved & Verified",
  rejected: "Rejected",
}

export function VerificationReviewPanel({ request }: VerificationReviewPanelProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const approveVerification = useApproveVerification()
  const rejectVerification = useRejectVerification()

  const handleApprove = async () => {
    await approveVerification.mutateAsync(request.id)
    setApproveDialogOpen(false)
  }

  const handleReject = async (reason: string, note?: string) => {
    await rejectVerification.mutateAsync({
      id: request.id,
      reason: note ? `${reason}: ${note}` : reason,
    })
    setRejectDialogOpen(false)
  }

  return (
    <>
      <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden space-y-0 sticky top-20 border-0">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60">
          <CardTitle className="text-sm sm:text-base font-bold text-foreground">
            Review Summary & Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Current Status</span>
              <StatusBadge
                label={STATUS_LABEL_MAP[request.status]}
                tone={STATUS_TONE_MAP[request.status]}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Verification Scope</span>
              <span className="font-semibold capitalize text-foreground">{request.type}</span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
              <span className="text-muted-foreground">Submitted At</span>
              <span className="font-medium text-foreground">{request.submittedDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Attached Files</span>
              <span className="font-bold text-foreground">{request.documents.length} documents</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <Button
              onClick={() => setApproveDialogOpen(true)}
              disabled={request.status === "approved" || approveVerification.isPending || rejectVerification.isPending}
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs rounded-lg gap-2 cursor-pointer shadow-xs"
            >
              <ShieldCheck size={16} weight="bold" />
              <span>Approve Verification</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setRejectDialogOpen(true)}
              disabled={request.status === "rejected" || approveVerification.isPending || rejectVerification.isPending}
              className="w-full h-9 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg gap-1.5 cursor-pointer"
            >
              <XCircle size={15} />
              <span>Reject Request</span>
            </Button>
          </div>

          {request.status === "approved" && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs flex items-start gap-2">
              <CheckCircle size={16} className="shrink-0 mt-0.5" weight="fill" />
              <p className="leading-relaxed">
                This seller has been approved and verified. The trust badge is active on their profile.
              </p>
            </div>
          )}

          {request.status === "rejected" && request.rejectionReason && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
              <p className="font-bold">Rejection Reason: {request.rejectionReason}</p>
              {request.rejectionNote && <p className="text-[11px]">{request.rejectionNote}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <ApproveVerificationDialog
        request={request}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onApprove={() => void handleApprove()}
        isSubmitting={approveVerification.isPending}
      />

      <RejectVerificationDialog
        request={request}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onReject={(reason, note) => void handleReject(reason, note)}
        isSubmitting={rejectVerification.isPending}
      />
    </>
  )
}
