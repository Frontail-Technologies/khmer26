import type { Metadata } from "next"
import { VerificationSummaryMetrics } from "@/features/admin/verifications/components/verification-summary-metrics"
import { VerificationTable } from "@/features/admin/verifications/components/verification-table"
import { DEMO_VERIFICATION_STATS } from "@/features/admin/verifications/data/demo-verification-stats"
import { DEMO_VERIFICATION_REQUESTS } from "@/features/admin/verifications/data/demo-verifications"

export const metadata: Metadata = {
  title: "Seller Verifications",
  description: "Review identity and business verification requests submitted by sellers.",
}

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <VerificationSummaryMetrics stats={DEMO_VERIFICATION_STATS} />
      <VerificationTable initialData={DEMO_VERIFICATION_REQUESTS} />
    </div>
  )
}
