"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, SealCheck } from "@phosphor-icons/react"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { VerificationSellerCard } from "./verification-seller-card"
import { VerificationDocuments } from "./verification-documents"
import { VerificationHistoryTimeline } from "./verification-history-timeline"
import { VerificationReviewPanel } from "./verification-review-panel"
import { useAdminVerificationDetail } from "../hooks/verifications.queries"
import type { VerificationStatus } from "../types"

interface VerificationDetailWorkspaceProps {
  verificationId: string
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

export function VerificationDetailWorkspace({ verificationId }: VerificationDetailWorkspaceProps) {
  const { data: request, isLoading } = useAdminVerificationDetail(verificationId)

  if (isLoading && !request) {
    return (
      <div className="flex items-center justify-center py-16 text-xs text-muted-foreground">
        Loading verification request...
      </div>
    )
  }

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
        <div className="space-y-1">
          <Link
            href="/admin/verifications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-0.5"
          >
            <ArrowLeft size={13} weight="bold" />
            <span>Back to Verifications</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <SealCheck size={16} weight="fill" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-mono">
                {request.id}
              </h1>
            </div>

            <StatusBadge
              label={STATUS_LABEL_MAP[request.status]}
              tone={STATUS_TONE_MAP[request.status]}
              size="sm"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Submitted {request.submittedDate} by{" "}
            <span className="font-semibold text-foreground">{request.seller.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <VerificationSellerCard
            seller={request.seller}
            identityDetails={request.identityDetails}
            businessDetails={request.businessDetails}
          />

          <VerificationDocuments documents={request.documents} />

          <VerificationHistoryTimeline history={request.history} />
        </div>

        <div className="lg:col-span-4">
          <VerificationReviewPanel request={request} />
        </div>
      </div>
    </div>
  )
}
