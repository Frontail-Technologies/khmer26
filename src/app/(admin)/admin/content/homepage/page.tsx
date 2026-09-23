import type { Metadata } from "next"
import { HomepageEditor } from "@/features/admin/content/components/homepage-editor"
import { DEMO_HOMEPAGE_SECTIONS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Homepage Content",
  description: "Curate featured collections, slider banners, and discovery blocks.",
}

export default function AdminHomepageContentPage() {
  return <HomepageEditor initialSections={DEMO_HOMEPAGE_SECTIONS} />
}
