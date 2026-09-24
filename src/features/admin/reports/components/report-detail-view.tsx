"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Tag,
  User,
  Storefront,
  ChatCircle,
  WarningOctagon,
  Image as ImageIcon,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { ResolveReportDialog } from "./resolve-report-dialog"
import { DismissReportDialog } from "./dismiss-report-dialog"
import type { AdminReport, AdminReportStatus, AdminReportTargetType } from "../types"

interface ReportDetailViewProps {
  report: AdminReport
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
  chat: "Chat Conversation",
}

function getTargetIcon(type: AdminReportTargetType) {
  switch (type) {
    case "listing":
      return <Tag size={16} weight="bold" />
    case "seller":
      return <Storefront size={16} weight="bold" />
    case "user":
      return <User size={16} weight="bold" />
    case "chat":
      return <ChatCircle size={16} weight="bold" />
  }
}

export function ReportDetailView({ report }: ReportDetailViewProps) {
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false)

  const statusConf = STATUS_CONFIG[report.status] || { label: report.status, tone: "neutral" as StatusTone }
  const target = report.target
  const hasAttachment = report.evidence && report.evidence.length > 0

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            render={
              <Link href="/admin/reports" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                <ArrowLeft size={14} />
                <span>Reports</span>
              </Link>
            }
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-card shadow-2xs border-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <WarningOctagon size={22} weight="fill" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-foreground font-mono">
                    {report.id}
                  </h1>
                  <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 h-5">
                    {TARGET_TYPE_LABELS[report.targetType] || report.targetType}
                  </Badge>
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Reported on {report.createdDate} · Target ID: <span className="font-mono text-foreground font-medium">{target.id}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link href={target.href} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <ArrowUpRight size={14} />
                    <span>View Target Entity</span>
                  </Link>
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-4">
            <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  {getTargetIcon(report.targetType)}
                  Reported Item Preview
                </CardTitle>
                <span className="font-mono text-xs text-muted-foreground">{target.id}</span>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs">
                <div className="flex flex-col sm:flex-row items-start gap-3.5">
                  {target.thumbnail ? (
                    <div className="relative size-20 sm:size-24 rounded-lg overflow-hidden border border-border/70 bg-muted shrink-0">
                      <Image
                        src={target.thumbnail}
                        alt={target.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border/60">
                      {getTargetIcon(report.targetType)}
                    </div>
                  )}

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-foreground leading-snug">
                      {target.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
                      {target.category && (
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Category</span>
                          <span className="font-medium text-foreground">{target.category}</span>
                        </div>
                      )}
                      {target.price !== undefined && (
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Price</span>
                          <span className="font-medium text-foreground">${target.price.toLocaleString()}</span>
                        </div>
                      )}
                      {target.sellerName && (
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Seller / Owner</span>
                          <span className="font-medium text-foreground">{target.sellerName}</span>
                        </div>
                      )}
                      {target.status && (
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Entity Status</span>
                          <span className="font-medium text-foreground capitalize">{target.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border/60">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <WarningOctagon size={14} />
                  Report Reason & Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-border/40">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Reported Reason</span>
                    <span className="font-bold text-foreground text-xs mt-0.5 block">{report.reasonLabel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Reported By</span>
                    <span className="font-semibold text-foreground text-xs mt-0.5 block">
                      {report.reporter.name} <span className="text-muted-foreground text-[11px] font-normal capitalize">({report.reporter.accountType})</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-muted-foreground block text-[11px]">Reporter Statement</span>
                  <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/40 text-xs">
                    {"\""}{report.statement}{"\""}
                  </p>
                </div>

                {hasAttachment && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <span className="text-muted-foreground block text-[11px] flex items-center gap-1">
                      <ImageIcon size={14} />
                      Attached Screenshot / Evidence
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {report.evidence?.map((ev) => (
                        <div key={ev.id} className="p-2.5 rounded-lg bg-muted/20 border border-border/60 space-y-2">
                          {ev.url && (
                            <div className="relative h-32 rounded-md overflow-hidden bg-muted border border-border/40">
                              <Image
                                src={ev.url}
                                alt={ev.title}
                                fill
                                sizes="200px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium text-[11px] text-foreground block truncate">
                            {ev.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border/60">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Report Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Status</span>
                  <StatusBadge label={statusConf.label} tone={statusConf.tone} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reported Date</span>
                  <span className="font-semibold text-foreground">{report.createdDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target Type</span>
                  <span className="font-semibold text-foreground capitalize">{report.targetType}</span>
                </div>
                {report.resolvedAt && (
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Resolved Date</span>
                    <span className="font-semibold text-foreground">{report.resolvedAt}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-0 shadow-2xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border/60">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Moderation Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setResolveDialogOpen(true)}
                  className="w-full text-xs justify-start cursor-pointer"
                >
                  <CheckCircle size={14} className="mr-2" />
                  Resolve Report
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDismissDialogOpen(true)}
                  className="w-full text-xs justify-start cursor-pointer"
                >
                  <XCircle size={14} className="mr-2" />
                  Dismiss Report
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  render={
                    <Link href={target.href} className="w-full text-xs justify-start flex items-center cursor-pointer">
                      <ArrowUpRight size={14} className="mr-2" />
                      Open Reported Item
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ResolveReportDialog
        report={report}
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
      />

      <DismissReportDialog
        report={report}
        open={dismissDialogOpen}
        onOpenChange={setDismissDialogOpen}
      />
    </>
  )
}
