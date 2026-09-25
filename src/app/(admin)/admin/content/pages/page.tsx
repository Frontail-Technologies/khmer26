import type { Metadata } from "next"
import { StaticPagesWorkspace } from "@/features/admin/content/components/static-pages-workspace"
import { DEMO_STATIC_PAGES } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Static Pages",
  description: "Manage marketplace policy and informational static articles.",
}

export default function AdminStaticPagesPage() {
  return <StaticPagesWorkspace initialPages={DEMO_STATIC_PAGES} />
}
