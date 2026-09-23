"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaperPlaneTilt, ListBullets, FileText } from "@phosphor-icons/react"
import { NotificationSummaryMetrics } from "./notification-summary-metrics"
import { NotificationComposer } from "./notification-composer"
import { NotificationHistoryTable } from "./notification-history-table"
import { NotificationTemplatesGrid } from "./notification-templates-grid"
import type {
  NotificationStats,
  NotificationCampaign,
  NotificationTemplate,
} from "../types"

interface NotificationWorkspaceProps {
  stats: NotificationStats
  campaigns: NotificationCampaign[]
  templates: NotificationTemplate[]
}

export function NotificationWorkspace({
  stats,
  campaigns,
  templates,
}: NotificationWorkspaceProps) {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <NotificationSummaryMetrics stats={stats} />

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid grid-cols-3 h-9 bg-muted/60 p-1 mb-4 w-full sm:w-[480px]">
          <TabsTrigger value="compose" className="text-xs">
            <PaperPlaneTilt size={13} className="mr-1.5" />
            Compose Broadcast
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <ListBullets size={13} className="mr-1.5" />
            History ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs">
            <FileText size={13} className="mr-1.5" />
            Templates ({templates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <NotificationComposer />
        </TabsContent>

        <TabsContent value="history">
          <NotificationHistoryTable initialCampaigns={campaigns} />
        </TabsContent>

        <TabsContent value="templates">
          <NotificationTemplatesGrid templates={templates} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
