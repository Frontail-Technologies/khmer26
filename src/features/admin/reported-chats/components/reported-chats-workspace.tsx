"use client"

import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  WarningOctagon,
  Clock,
  CheckCircle,
  ShieldWarning,
} from "@phosphor-icons/react"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ReportedChatListItem } from "./reported-chat-list-item"
import { ReportedChatMessagesView } from "./reported-chat-messages-view"
import { ReportedChatCasePanel } from "./reported-chat-case-panel"
import type { ReportedChatCase, ReportedChatStats } from "../types"

interface ReportedChatsWorkspaceProps {
  stats: ReportedChatStats
  initialCases: ReportedChatCase[]
}

export function ReportedChatsWorkspace({
  stats,
  initialCases,
}: ReportedChatsWorkspaceProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCases[0]?.id ?? "")
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  const filteredCases = useMemo(() => {
    return initialCases.filter((c) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        c.id.toLowerCase().includes(q) ||
        c.reportId.toLowerCase().includes(q) ||
        c.buyer.name.toLowerCase().includes(q) ||
        c.seller.name.toLowerCase().includes(q) ||
        c.reportedReason.toLowerCase().includes(q)
      )
    })
  }, [initialCases, searchQuery])

  const selectedCase = useMemo(() => {
    return (
      filteredCases.find((c) => c.id === selectedCaseId) ??
      filteredCases[0] ??
      null
    )
  }, [filteredCases, selectedCaseId])

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id)
    setMobileDetailOpen(true)
  }

  const metrics: AdminMetricItemProps[] = [
    {
      label: "Flagged Incidents",
      value: stats.openCases,
      subtext: "Awaiting review",
      icon: <WarningOctagon size={16} weight="bold" />,
      tone: "destructive",
    },
    {
      label: "In Review",
      value: stats.inReviewCases,
      subtext: "Under inspection",
      icon: <Clock size={16} weight="bold" />,
      tone: "warning",
    },
    {
      label: "Auto-Flagged Spam",
      value: stats.autoFlaggedSpam,
      subtext: "Filtered by rules",
      icon: <ShieldWarning size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Resolved (30d)",
      value: stats.resolved30d,
      subtext: "Closed cases",
      icon: <CheckCircle size={16} weight="bold" />,
      tone: "success",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-5">
      <AdminMetricGroup metrics={metrics} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <MagnifyingGlass
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search chat incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9.5 pr-4 rounded-xl border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
            />
          </div>

          <div className="space-y-2">
            {filteredCases.map((c) => (
              <ReportedChatListItem
                key={c.id}
                chatCase={c}
                isSelected={c.id === selectedCaseId}
                onSelect={() => handleSelectCase(c.id)}
              />
            ))}
            {filteredCases.length === 0 && (
              <div className="p-8 text-center bg-card rounded-xl shadow-2xs text-xs text-muted-foreground">
                No reported chats found matching search.
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:grid lg:col-span-8 grid-cols-12 gap-4 items-start">
          <div className="col-span-7">
            <ReportedChatMessagesView chatCase={selectedCase} />
          </div>
          <div className="col-span-5">
            <ReportedChatCasePanel chatCase={selectedCase} />
          </div>
        </div>
      </div>

      <Sheet open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
        <SheetContent side="bottom" className="h-[90vh] p-0 sm:max-w-full rounded-t-xl">
          <SheetHeader className="p-4 border-b border-border/60">
            <SheetTitle className="text-sm font-bold">
              Chat Investigation #{selectedCase?.id}
            </SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-4 overflow-y-auto h-[calc(90vh-60px)]">
            <ReportedChatMessagesView chatCase={selectedCase} />
            <ReportedChatCasePanel chatCase={selectedCase} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
