import type { Metadata } from "next"
import { ReportedChatsWorkspace } from "@/features/admin/reported-chats/components/reported-chats-workspace"
import { DEMO_REPORTED_CHATS } from "@/features/admin/reported-chats/data/demo-reported-chats"

export const metadata: Metadata = {
  title: "Reported Chats",
  description: "Moderation queue for user-reported marketplace conversations.",
}

export default function AdminReportedChatsPage() {
  return (
    <ReportedChatsWorkspace
      initialReports={DEMO_REPORTED_CHATS}
    />
  )
}
