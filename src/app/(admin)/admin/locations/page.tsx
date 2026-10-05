import type { Metadata } from "next"
import { LocationWorkspace } from "@/features/admin/locations/components/location-workspace"

export const metadata: Metadata = {
  title: "Cambodia Locations & Divisions",
  description: "Manage Cambodia administrative divisions, provinces, and districts.",
}

export default function AdminLocationsPage() {
  return <LocationWorkspace />
}
