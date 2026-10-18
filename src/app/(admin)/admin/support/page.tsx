import type { Metadata } from "next"
import { SupportInboxWorkspace } from "@/features/admin/support/components/support-inbox-workspace"

export const metadata: Metadata = { title: "Support Inbox" }

export default function AdminSupportPage() {
  return <SupportInboxWorkspace />
}
