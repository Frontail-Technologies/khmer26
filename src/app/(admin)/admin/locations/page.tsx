import type { Metadata } from "next"
import { LocationWorkspace } from "@/features/admin/locations/components/location-workspace"
import {
  DEMO_LOCATION_STATS,
  DEMO_CAMBODIA_PROVINCES,
} from "@/features/admin/locations/data/demo-location-data"

export const metadata: Metadata = {
  title: "Cambodia Locations & Divisions",
  description: "Manage Cambodia administrative divisions, provinces, and districts.",
}

export default function AdminLocationsPage() {
  return (
    <LocationWorkspace
      stats={DEMO_LOCATION_STATS}
      provinces={DEMO_CAMBODIA_PROVINCES}
    />
  )
}
