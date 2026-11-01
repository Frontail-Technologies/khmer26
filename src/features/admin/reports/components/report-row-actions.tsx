"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, DotsThreeVertical, Eye, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { AdminReport } from "../types"
import { ResolveReportDialog } from "./resolve-report-dialog"
import { DismissReportDialog } from "./dismiss-report-dialog"

/** Resolve / Dismiss right from the list for open reports; details stay one tap away in ⋯. */
export function ReportRowActions({ report, layout = "row" }: { report: AdminReport; layout?: "row" | "card" }) {
  const [resolveOpen, setResolveOpen] = useState(false)
  const [dismissOpen, setDismissOpen] = useState(false)
  const open = report.status === "open" || report.status === "in_review"
  const card = layout === "card"

  return (
    <div className={cn("flex items-center gap-1.5", card ? "w-full" : "justify-end")} onClick={(event) => event.stopPropagation()}>
      {open ? (
        <>
          <Button
            size="sm"
            onClick={() => setResolveOpen(true)}
            className={cn("h-8 gap-1 rounded-full bg-success px-3 text-xs font-bold text-success-foreground hover:bg-success/90", card && "h-9 flex-1")}
          >
            <Check size={14} weight="bold" />
            Resolve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissOpen(true)}
            className={cn("h-8 gap-1 rounded-full px-3 text-xs font-semibold", card && "h-9 flex-1")}
          >
            <X size={14} weight="bold" />
            Dismiss
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className={cn("h-8 gap-1 rounded-full px-3 text-xs font-semibold", card && "h-9 flex-1")}
          render={
            <Link href={`/reports/${report.id}`}>
              <Eye size={14} />
              Open
            </Link>
          }
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className={cn("size-8 rounded-full text-muted-foreground hover:text-foreground", card && "size-9 border border-border/70")}
              aria-label="More actions"
            >
              <DotsThreeVertical size={16} weight="bold" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-md">
          <DropdownMenuItem
            render={
              <Link href={`/reports/${report.id}`} className="flex w-full items-center gap-2 text-xs font-medium">
                <Eye size={14} />
                <span>Full report</span>
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link href={report.target.href} className="flex w-full items-center gap-2 text-xs font-medium">
                <ArrowUpRight size={14} />
                <span>Reported item</span>
              </Link>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <>
          <ResolveReportDialog report={report} open={resolveOpen} onOpenChange={setResolveOpen} />
          <DismissReportDialog report={report} open={dismissOpen} onOpenChange={setDismissOpen} />
        </>
      )}
    </div>
  )
}
