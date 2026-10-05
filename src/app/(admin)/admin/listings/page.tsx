import type { Metadata } from "next"
import { ListingTable } from "@/features/admin/listings/components/listing-table"

export const metadata: Metadata = {
  title: "Listings Moderation",
  description: "Review, moderate and manage marketplace listings across Cambodia.",
}

export default function AdminListingsPage() {
  return <ListingTable />
}
