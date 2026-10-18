import type { Metadata } from "next"
import { PolicyPagesWorkspace } from "@/features/admin/content/components/policy-pages-workspace"

export const metadata: Metadata = {
  title: "Policy Pages",
  description: "Manage legal policies and marketplace posting rules.",
}

export default function AdminPolicyPagesPage() {
  return <PolicyPagesWorkspace />
}
