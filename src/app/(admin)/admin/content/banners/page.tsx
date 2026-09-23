import type { Metadata } from "next"
import { BannersManager } from "@/features/admin/content/components/banners-manager"
import { DEMO_ADMIN_BANNERS } from "@/features/admin/content/data/demo-content-data"

export const metadata: Metadata = {
  title: "Banners",
  description: "Schedule and manage marketing promotional banners.",
}

export default function AdminBannersPage() {
  return <BannersManager initialBanners={DEMO_ADMIN_BANNERS} />
}
