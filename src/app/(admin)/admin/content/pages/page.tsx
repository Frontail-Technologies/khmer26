import type { Metadata } from "next"
import { StaticPagesWorkspace } from "@/features/admin/content/components/static-pages-workspace"

export const metadata: Metadata = {
  title: "Static Pages",
  description: "Manage legal and informational pages like Terms of Service and Privacy Policy.",
}

export default function AdminStaticPagesPage() {
  return <StaticPagesWorkspace />
}
