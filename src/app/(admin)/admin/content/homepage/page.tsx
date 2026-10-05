import type { Metadata } from "next"
import { HomepageWorkspace } from "@/features/admin/content/components/homepage-workspace"

export const metadata: Metadata = {
  title: "Homepage Management",
  description: "Manage homepage sections, visibility, ordering, and popular categories.",
}

export default function AdminHomepageContentPage() {
  return (
    <HomepageWorkspace
      initialPopularCategories={[]}
    />
  )
}
