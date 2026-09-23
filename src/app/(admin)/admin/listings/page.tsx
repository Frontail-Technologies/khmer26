import type { Metadata } from "next"
import { ListingTable } from "@/features/admin/listings/components/listing-table"
import { DEMO_ADMIN_LISTINGS } from "@/features/admin/listings/data/demo-admin-listings"

export const metadata: Metadata = {
  title: "Listings Moderation",
  description: "Review, moderate and manage marketplace listings across Cambodia.",
}

export default function AdminListingsPage() {
  return <ListingTable initialData={DEMO_ADMIN_LISTINGS} />
}
