import type { Metadata } from "next"
import { VerificationTable } from "@/features/admin/verifications/components/verification-table"

export const metadata: Metadata = {
  title: "Seller Verifications",
  description: "Review identity and business verification requests submitted by sellers.",
}

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-3.5 sm:space-y-4">
      <VerificationTable />
    </div>
  )
}
