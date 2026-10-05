import type { Metadata } from "next"
import { SafetyTipsWorkspace } from "@/features/admin/content/components/safety-tips-workspace"

export const metadata: Metadata = {
  title: "Safety Tips",
  description: "Manage marketplace trust and safety tips displayed across surfaces.",
}

export default function AdminSafetyTipsPage() {
  return <SafetyTipsWorkspace />
}
