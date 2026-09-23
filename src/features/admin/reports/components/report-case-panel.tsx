"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  ShieldWarning,
  ArrowSquareOut,
  UserGear,
  Clock,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, type StatusTone } from "@/components/shared/status-badge"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  getSelectOptionLabel,
} from "@/components/ui/select"
import { ResolveReportDialog } from "./resolve-report-dialog"
import { DismissReportDialog } from "./dismiss-report-dialog"
import { EscalateReportDialog } from "./escalate-report-dialog"
import type { AdminReport, AdminReportStatus } from "../types"
import { cn } from "@/lib/utils"

interface ReportCasePanelProps {
  report: AdminReport
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

const MODERATOR_OPTIONS = [
  { value: "unassigned", label: "Unassigned" },
  { value: "dara_sok", label: "Dara Sok — Super Admin" },
  { value: "channary_meas", label: "Channary Meas — Moderator" },
  { value: "vannak_lim", label: "Vannak Lim — Moderator" },
]

export function ReportCasePanel({ report }: ReportCasePanelProps) {
  const [assignedModerator, setAssignedModerator] = useState(
    report.assignedTo ? "dara_sok" : "unassigned"
  )
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false)
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-4 lg:sticky lg:top-20">
        <Card className="rounded-xl bg-card p-0 shadow-2xs overflow-hidden border-0">
          <CardHeader className="p-3.5 sm:p-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="size-6.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <UserGear size={14} weight="bold" />
              </div>
              <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
                Case Management
              </CardTitle>
            </div>

            <Badge variant="outline" className="text-[10px] font-mono font-bold">
              {report.id}
            </Badge>
          </CardHeader>

          <CardContent className="p-3.5 sm:p-4 space-y-4">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Case Status</span>
                <StatusBadge
                  label={STATUS_LABEL_MAP[report.status]}
                  tone={STATUS_TONE_MAP[report.status]}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Priority Tier</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0 h-4.5 uppercase",
                    report.priority === "urgent"
                      ? "bg-destructive/10 text-destructive border-destructive/30"
                      : report.priority === "high"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {report.priority}
                </Badge>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Target Entity</span>
                <span className="font-mono font-semibold text-foreground">
                  {report.target.id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Target Category</span>
                <span className="font-medium text-foreground capitalize">
                  {report.targetType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-medium">Report Intake</span>
                <span className="text-foreground font-medium">{report.createdAt}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60">
              <Field className="gap-2">
                <FieldLabel>Assigned Moderator</FieldLabel>
                <Select
                  value={assignedModerator}
                  items={MODERATOR_OPTIONS}
                  onValueChange={(val) => setAssignedModerator(val ?? "")}
                >
                  <SelectTrigger size="default" className="h-9 text-xs bg-muted/30 rounded-xl">
                    <SelectValue>
                      {(val) => getSelectOptionLabel(MODERATOR_OPTIONS, val, "Assign moderator")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    {MODERATOR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="pt-3 border-t border-border/60 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Case Resolution Actions
              </span>

              <Button
                size="sm"
                onClick={() => setResolveDialogOpen(true)}
                className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 rounded-xl cursor-pointer"
              >
                <CheckCircle size={15} weight="bold" />
                <span>Resolve Report</span>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEscalateDialogOpen(true)}
                  className="h-9 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 font-semibold gap-1.5 rounded-xl cursor-pointer"
                >
                  <ShieldWarning size={14} weight="bold" />
                  <span>Escalate</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDismissDialogOpen(true)}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground font-semibold gap-1.5 rounded-xl cursor-pointer"
                >
                  <XCircle size={14} weight="bold" />
                  <span>Dismiss</span>
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                render={
                  <Link href={report.target.href}>
                    <ArrowSquareOut size={13} weight="bold" />
                    <span>
                      {report.target.type === "listing"
                        ? "Open Listing Review"
                        : report.target.type === "chat"
                        ? "Open Reported Chat"
                        : "Open Target Entity"}
                    </span>
                  </Link>
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl bg-card p-3.5 shadow-2xs space-y-2 text-xs border-0">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[11px]">
            <Clock size={13} />
            <span>Target Response SLA</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Urgent safety cases must be evaluated within 2 hours. Normal priority queue SLA target is 12 hours.
          </p>
        </Card>
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

      <EscalateReportDialog
        report={report}
        open={escalateDialogOpen}
        onOpenChange={setEscalateDialogOpen}
      />
    </>
  )
}
