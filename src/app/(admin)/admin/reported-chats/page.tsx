import type { Metadata } from "next"
import { ReportedChatsWorkspace } from "@/features/admin/reported-chats/components/reported-chats-workspace"
import {
  DEMO_REPORTED_CHAT_STATS,
  DEMO_REPORTED_CHATS,
} from "@/features/admin/reported-chats/data/demo-reported-chats-data"

export const metadata: Metadata = {
  title: "Reported Chats",
  description: "Investigate flagged buyer-seller conversations and scam alerts.",
}

export default function AdminReportedChatsPage() {
  return (
    <ReportedChatsWorkspace
      stats={DEMO_REPORTED_CHAT_STATS}
      initialCases={DEMO_REPORTED_CHATS}
    />
  )
}
