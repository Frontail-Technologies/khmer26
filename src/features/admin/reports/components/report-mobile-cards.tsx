"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Flag,
  Tag,
  Storefront,
  User,
  ChatCircle,
  CaretRight,
  ArrowsDownUp,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import type {
  AdminReport,
  AdminReportStatus,
  AdminReportTargetType,
} from "../types"
import { cn } from "@/lib/utils"

interface ReportMobileCardsProps {
  data: AdminReport[]
  sortBy: string
  onSortChange: (value: string) => void
}

const STATUS_TONE_MAP: Record<AdminReportStatus, StatusTone> = {
  open: "warning",
  in_review: "info",
  resolved: "success",
  dismissed: "neutral",
  escalated: "destructive",
}

const STATUS_LABEL_MAP: Record<AdminReportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
  escalated: "Escalated",
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
]

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

export function ReportMobileCards({
  data,
  sortBy,
  onSortChange,
}: ReportMobileCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 pb-1">
        <span className="text-xs font-semibold text-muted-foreground">
          {data.length} {data.length === 1 ? "Report" : "Reports"}
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowsDownUp size={13} className="text-muted-foreground" />
          <div className="w-32">
            <Select
              value={sortBy}
              items={SORT_OPTIONS}
              onValueChange={(val) => onSortChange(val ?? "newest")}
            >
              <SelectTrigger size="sm" className="h-7.5 text-[11px] bg-muted/40 rounded-lg">
                <SelectValue>
                  {(val) => getSelectOptionLabel(SORT_OPTIONS, val, "Sort by")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" align="end">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.length === 0 ? (
          <Card className="rounded-xl p-6 text-center bg-card shadow-2xs border-0">
            <p className="text-xs text-muted-foreground">No reports matching filters</p>
          </Card>
        ) : (
          data.map((report) => {
            const target = report.target
            return (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="block group focus:outline-none"
              >
                <Card className="rounded-xl bg-card p-3 shadow-2xs transition-colors group-hover:bg-muted/20 border-0">
                  <CardContent className="p-0 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-6 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                          <Flag size={12} weight="fill" />
                        </div>
                        <span className="font-mono text-xs font-bold text-foreground">
                          {report.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0 h-4.5 uppercase",
                            report.priority === "urgent"
                              ? "bg-destructive/10 text-destructive border-destructive/30"
                              : report.priority === "high"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-muted/60 text-muted-foreground border-border"
                          )}
                        >
                          {report.priority}
                        </Badge>
                      </div>

                      <StatusBadge
                        label={STATUS_LABEL_MAP[report.status]}
                        tone={STATUS_TONE_MAP[report.status]}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="relative size-10 rounded-lg overflow-hidden border border-border/70 bg-muted/40 shrink-0 flex items-center justify-center">
                        {target.thumbnail ? (
                          <Image
                            src={target.thumbnail}
                            alt={target.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground">
                            {getTargetIcon(target.type)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {target.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="font-mono">{target.id}</span>
                          <span>•</span>
                          <span className="capitalize">{target.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-2 space-y-1">
                      <p className="text-[11px] font-semibold text-foreground truncate">
                        {report.reasonLabel}
                      </p>
                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {report.statement}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>By {report.reporter.name}</span>
                        <span>•</span>
                        <span>{report.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary shrink-0 font-semibold">
                        <span>Review</span>
                        <CaretRight size={11} weight="bold" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
