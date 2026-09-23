import type { Metadata } from "next"
import { FeaturedCurator } from "@/features/admin/content/components/featured-curator"
import { DEMO_FEATURED_LISTINGS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Featured Content",
  description: "Select and prioritize sponsored listings and categories.",
}

export default function AdminFeaturedContentPage() {
  return <FeaturedCurator initialFeaturedListings={DEMO_FEATURED_LISTINGS} />
}
