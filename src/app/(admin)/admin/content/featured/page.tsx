import type { Metadata } from "next"
import { FeaturedSectionsWorkspace } from "@/features/admin/content/components/featured-sections-workspace"

export const metadata: Metadata = {
  title: "Featured Sections",
  description: "Manage dynamic listing collections on homepage and discovery surfaces.",
}

export default function AdminFeaturedContentPage() {
  return <FeaturedSectionsWorkspace />
}
