import type { Metadata } from "next"
import { SafetyTipsWorkspace } from "@/features/admin/content/components/safety-tips-workspace"
import { DEMO_SAFETY_TIPS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Safety Tips",
  description: "Manage marketplace trust and safety tips displayed across surfaces.",
}

export default function AdminSafetyTipsPage() {
  return <SafetyTipsWorkspace initialTips={DEMO_SAFETY_TIPS} />
}
