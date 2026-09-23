import type { Metadata } from "next"
import { ContentOverview } from "@/features/admin/content/components/content-overview"

export const metadata: Metadata = {
  title: "Content Management",
  description: "Manage marketplace homepage, banners, featured collections and static pages.",
}

export default function AdminContentOverviewPage() {
  return <ContentOverview />
}
