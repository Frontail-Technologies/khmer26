import type { Metadata } from "next"
import { AuditTable } from "@/features/admin/audit-log/components/audit-table"

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Review Admin activity.",
}

export default function AdminAuditLogPage() {
  return <AuditTable />
}
