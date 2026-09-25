import type { Metadata } from "next"
import { HomepageWorkspace } from "@/features/admin/content/components/homepage-workspace"
import {
  DEMO_HOMEPAGE_SECTIONS,
  DEMO_POPULAR_CATEGORIES,
} from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Homepage Management",
  description: "Manage homepage sections, visibility, ordering, and popular categories.",
}

export default function AdminHomepageContentPage() {
  return (
    <HomepageWorkspace
      initialSections={DEMO_HOMEPAGE_SECTIONS}
      initialPopularCategories={DEMO_POPULAR_CATEGORIES}
    />
  )
}
