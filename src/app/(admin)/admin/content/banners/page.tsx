import type { Metadata } from "next"
import { BannersWorkspace } from "@/features/admin/content/components/banners-workspace"

export const metadata: Metadata = {
  title: "Banners",
  description: "Schedule and manage promotional banners across marketplace surfaces.",
}

export default function AdminBannersPage() {
  return <BannersWorkspace />
}
