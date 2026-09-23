import type { Metadata } from "next"
import { AuditTable } from "@/features/admin/audit-log/components/audit-table"
import {
  DEMO_AUDIT_STATS,
  DEMO_AUDIT_LOGS,
} from "@/features/admin/audit-log/data/demo-audit-data"

export const metadata: Metadata = {
  title: "Audit Log & Telemetry",
  description: "Comprehensive chronological ledger of administrative operations.",
}

export default function AdminAuditLogPage() {
  return (
    <AuditTable
      stats={DEMO_AUDIT_STATS}
      initialEntries={DEMO_AUDIT_LOGS}
    />
  )
}
