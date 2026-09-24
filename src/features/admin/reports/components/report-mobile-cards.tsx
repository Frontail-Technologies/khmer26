"use client"

import Link from "next/link"
import Image from "next/image"
import { Tag, User, Storefront, ChatCircle, CaretRight } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import type { AdminReport, AdminReportStatus, AdminReportTargetType } from "../types"

interface ReportMobileCardsProps {
  data: AdminReport[]
}

const STATUS_CONFIG: Record<AdminReportStatus, { label: string; tone: StatusTone }> = {
  open: { label: "Open", tone: "warning" },
  in_review: { label: "In Review", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
}

const TARGET_TYPE_LABELS: Record<AdminReportTargetType, string> = {
  listing: "Listing",
  user: "User",
  seller: "Seller",
  chat: "Chat",
}

function getTargetIcon(type: AdminReportTargetType) {
  switch (type) {
    case "listing":
      return <Tag size={13} weight="bold" />
    case "seller":
      return <Storefront size={13} weight="bold" />
    case "user":
      return <User size={13} weight="bold" />
    case "chat":
      return <ChatCircle size={13} weight="bold" />
  }
}

export function ReportMobileCards({ data }: ReportMobileCardsProps) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-xl shadow-2xs">
        <p className="text-xs text-muted-foreground">No reports match your filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {data.map((report) => {
        const conf = STATUS_CONFIG[report.status] || { label: report.status, tone: "neutral" as StatusTone }

        return (
          <Link
            key={report.id}
            href={`/admin/reports/${report.id}`}
            className="block group"
          >
            <Card className="p-3.5 bg-card shadow-2xs rounded-xl hover:bg-muted/20 transition-colors border-0">
              <div className="flex items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {report.id}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 h-4">
                    {TARGET_TYPE_LABELS[report.targetType] || report.targetType}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <StatusBadge label={conf.label} tone={conf.tone} size="sm" />
                  <CaretRight size={14} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30 border border-border/40 mb-2.5">
                <div className="relative size-8 rounded overflow-hidden border border-border/60 bg-muted/60 shrink-0 flex items-center justify-center">
                  {report.target.thumbnail ? (
                    <Image
                      src={report.target.thumbnail}
                      alt={report.target.title}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">{getTargetIcon(report.target.type)}</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-xs text-foreground block truncate group-hover:text-primary transition-colors">
                    {report.target.title}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground block">
                    {report.target.id}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground truncate">{report.reasonLabel}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{report.createdAt}</span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {report.statement}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                <span>Reporter: <strong className="text-foreground font-medium">{report.reporter.name}</strong></span>
                <span className="capitalize">{report.reporter.accountType}</span>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
