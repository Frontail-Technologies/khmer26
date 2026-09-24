"use client"

import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  Plus,
  PencilSimple,
  Prohibit,
  CheckCircle,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { ReportReasonDialog } from "./report-reason-dialog"
import type { AdminReportReasonItem, AdminReportTargetType } from "../types"

interface ReportReasonsTableProps {
  initialData: AdminReportReasonItem[]
}

const TARGET_LABEL_MAP: Record<AdminReportTargetType, string> = {
  listing: "Listings",
  user: "Users",
  seller: "Sellers",
  chat: "Chats",
}

export function ReportReasonsTable({ initialData }: ReportReasonsTableProps) {
  const [reasons, setReasons] = useState<AdminReportReasonItem[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<AdminReportReasonItem | null>(null)

  const filteredReasons = useMemo(() => {
    if (!searchQuery.trim()) return reasons
    const q = searchQuery.toLowerCase().trim()
    return reasons.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    )
  }, [reasons, searchQuery])

  const handleSaveReason = (saved: AdminReportReasonItem) => {
    setReasons((prev) => {
      const idx = prev.findIndex((r) => r.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
  }

  const handleToggleStatus = (id: string) => {
    setReasons((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    )
  }

  const handleOpenAdd = () => {
    setSelectedReason(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (reason: AdminReportReasonItem) => {
    setSelectedReason(reason)
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="rounded-xl border-0 bg-card shadow-2xs overflow-hidden flex flex-col">
        <div className="p-3.5 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search report reasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="h-9 text-xs font-semibold gap-1.5 rounded-lg cursor-pointer shrink-0"
          >
            <Plus size={14} weight="bold" />
            <span>Add Reason</span>
          </Button>
        </div>

        <div className="hidden md:block flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 dark:bg-muted/90 hover:bg-muted/60 dark:hover:bg-muted/90 border-b border-border/80 select-none">
                <TableHead className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80">
                  Reason
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80">
                  Applies To
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80">
                  Status
                </TableHead>
                <TableHead className="py-2.5 px-3.5 text-[11px] font-bold text-muted-foreground dark:text-foreground/80 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReasons.length > 0 ? (
                filteredReasons.map((reason) => (
                  <TableRow
                    key={reason.id}
                    className="transition-colors hover:bg-muted/30 border-b border-border/60 h-14"
                  >
                    <TableCell className="py-2.5 px-3.5 text-xs">
                      <div className="space-y-0.5 max-w-md">
                        <span className="font-semibold text-foreground block">
                          {reason.label}
                        </span>
                        {reason.description && (
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {reason.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5 px-3.5 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {reason.appliesTo.map((target) => (
                          <Badge
                            key={target}
                            variant="secondary"
                            className="text-[10px] font-medium px-1.5 py-0 h-4.5"
                          >
                            {TARGET_LABEL_MAP[target] || target}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5 px-3.5 text-xs">
                      <StatusBadge
                        label={reason.isActive ? "Active" : "Disabled"}
                        tone={reason.isActive ? "success" : "neutral"}
                        size="sm"
                      />
                    </TableCell>

                    <TableCell className="py-2.5 px-3.5 text-xs text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleOpenEdit(reason)}
                          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label="Edit reason"
                        >
                          <PencilSimple size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleStatus(reason.id)}
                          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          aria-label={reason.isActive ? "Disable reason" : "Enable reason"}
                        >
                          {reason.isActive ? (
                            <Prohibit size={14} className="text-amber-500" />
                          ) : (
                            <CheckCircle size={14} className="text-emerald-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-xs text-muted-foreground">
                    No report reasons found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="block md:hidden p-3.5 space-y-2.5">
          {filteredReasons.map((reason) => (
            <Card key={reason.id} className="p-3.5 bg-card shadow-2xs rounded-xl border-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <span className="font-semibold text-xs text-foreground block">
                    {reason.label}
                  </span>
                  {reason.description && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  )}
                </div>
                <StatusBadge
                  label={reason.isActive ? "Active" : "Disabled"}
                  tone={reason.isActive ? "success" : "neutral"}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {reason.appliesTo.map((target) => (
                    <Badge
                      key={target}
                      variant="secondary"
                      className="text-[10px] font-medium px-1.5 py-0 h-4.5"
                    >
                      {TARGET_LABEL_MAP[target] || target}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleOpenEdit(reason)}
                    className="h-7 px-2 text-[11px] cursor-pointer"
                  >
                    <PencilSimple size={12} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleToggleStatus(reason.id)}
                    className="h-7 px-2 text-[11px] cursor-pointer"
                  >
                    {reason.isActive ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t border-border/60 bg-muted/10 p-3 text-[11px] text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredReasons.length}</span> of{" "}
          <span className="font-semibold text-foreground">{reasons.length}</span> report reasons
        </div>
      </Card>

      <ReportReasonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reason={selectedReason}
        onSave={handleSaveReason}
      />
    </>
  )
}
