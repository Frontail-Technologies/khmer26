import type { Metadata } from "next"
import { SetupHub } from "@/features/admin/setup/setup-hub"

export const metadata: Metadata = { title: "Setup" }

export default function AdminSetupPage() {
  return <SetupHub />
}
