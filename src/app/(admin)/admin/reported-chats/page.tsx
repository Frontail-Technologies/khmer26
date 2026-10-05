import type { Metadata } from "next"
import { ReportedChatsWorkspace } from "@/features/admin/reported-chats/components/reported-chats-workspace"

export const metadata: Metadata = {
  title: "Reported Chats",
  description: "Moderation queue for user-reported marketplace conversations.",
}

export default function AdminReportedChatsPage() {
  return <ReportedChatsWorkspace />
}
