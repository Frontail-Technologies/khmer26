import { Suspense } from "react"
import type { Metadata } from "next"
import { ListingFieldsWorkspace } from "@/features/admin/listing-fields/components/listing-fields-workspace"

export const metadata: Metadata = {
  title: "Listing Fields Management",
  description: "Manage reusable listing field definitions and assign custom fields to categories.",
}

export default function AdminListingFieldsPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-xl bg-muted/20 animate-pulse" />}>
      <ListingFieldsWorkspace />
    </Suspense>
  )
}
