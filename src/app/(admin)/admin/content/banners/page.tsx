import type { Metadata } from "next"
import { BannersWorkspace } from "@/features/admin/content/components/banners-workspace"
import { DEMO_ADMIN_BANNERS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Banners",
  description: "Schedule and manage promotional banners across marketplace surfaces.",
}

export default function AdminBannersPage() {
  return <BannersWorkspace initialBanners={DEMO_ADMIN_BANNERS} />
}
