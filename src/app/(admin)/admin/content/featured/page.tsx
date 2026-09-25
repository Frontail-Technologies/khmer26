import type { Metadata } from "next"
import { FeaturedSectionsWorkspace } from "@/features/admin/content/components/featured-sections-workspace"
import { DEMO_FEATURED_SECTIONS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Featured Sections",
  description: "Manage dynamic listing collections on homepage and discovery surfaces.",
}

export default function AdminFeaturedContentPage() {
  return <FeaturedSectionsWorkspace initialSections={DEMO_FEATURED_SECTIONS} />
}
