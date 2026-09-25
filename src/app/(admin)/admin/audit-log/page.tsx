import type { Metadata } from "next"
import { AuditTable } from "@/features/admin/audit-log/components/audit-table"
import { DEMO_AUDIT_ENTRIES } from "@/features/admin/audit-log/data/demo-audit-data"

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Review Admin activity.",
}

export default function AdminAuditLogPage() {
  return <AuditTable initialEntries={DEMO_AUDIT_ENTRIES} />
}
