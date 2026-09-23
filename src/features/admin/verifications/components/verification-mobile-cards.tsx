import Link from "next/link"
import { CaretRight, FileText } from "@phosphor-icons/react"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { VerificationRequest, VerificationStatus } from "../types"

const STATUS_TONE_MAP: Record<VerificationStatus, StatusTone> = {
  pending: "warning",
  in_review: "info",
  approved: "success",
  rejected: "destructive",
}

const STATUS_LABEL_MAP: Record<VerificationStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
}

interface VerificationMobileCardsProps {
  data: VerificationRequest[]
}

export function VerificationMobileCards({ data }: VerificationMobileCardsProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 p-8 text-center bg-card">
        <p className="text-xs font-semibold text-foreground">No verification requests found</p>
        <p className="text-[11px] text-muted-foreground mt-1">Try changing your search keywords or active filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {data.map((request) => (
        <Link
          key={request.id}
          href={`/admin/verifications/${request.id}`}
          className="block"
        >
          <Card className="rounded-xl bg-card p-3.5 shadow-2xs hover:bg-muted/20 transition-all active:scale-[0.99] border-0">
            <CardContent className="p-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-9 rounded-full border border-border/70 shrink-0">
                    <AvatarImage src={request.seller.avatar} alt={request.seller.name} />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {request.seller.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground block truncate">
                      {request.seller.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {request.seller.phone || request.seller.email}
                    </span>
                  </div>
                </div>

                <StatusBadge
                  label={STATUS_LABEL_MAP[request.status]}
                  tone={STATUS_TONE_MAP[request.status]}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/60">
                <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground text-[10px]">
                  <span>{request.id}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="capitalize font-sans font-normal text-muted-foreground">{request.type}</span>
                </div>

                <div className="flex items-center gap-1">
                  <FileText size={12} />
                  <span>{request.documents.length} docs</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Submitted {request.submittedAt}</span>
                <span className="inline-flex items-center gap-0.5 text-primary font-semibold">
                  <span>Review</span>
                  <CaretRight size={11} weight="bold" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
