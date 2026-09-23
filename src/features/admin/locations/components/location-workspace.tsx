"use client"

import { useState } from "react"
import { MapPin, Buildings, HouseLine, Storefront } from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import { ProvinceListSidebar } from "./province-list-sidebar"
import { ProvinceDetailEditor } from "./province-detail-editor"
import type { CambodiaProvince, LocationStats } from "../types"

interface LocationWorkspaceProps {
  stats: LocationStats
  provinces: CambodiaProvince[]
}

export function LocationWorkspace({ stats, provinces }: LocationWorkspaceProps) {
  const [selectedId, setSelectedId] = useState<string>(provinces[0]?.id ?? "")

  const selectedProvince = provinces.find((p) => p.id === selectedId) ?? provinces[0] ?? null

  const metrics: AdminMetricItemProps[] = [
    {
      label: "Provinces & Capital",
      value: stats.provincesCount,
      subtext: "First-level divisions",
      icon: <MapPin size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Districts / Khans",
      value: stats.districtsCount,
      subtext: "Secondary units",
      icon: <Buildings size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Communes / Sangkats",
      value: stats.sangkatsCount.toLocaleString(),
      subtext: "Local boundaries",
      icon: <HouseLine size={16} weight="bold" />,
      tone: "purple",
    },
    {
      label: "Marketplace Ads",
      value: stats.activeListingsCount.toLocaleString(),
      subtext: "Geo-tagged ads",
      icon: <Storefront size={16} weight="bold" />,
      tone: "success",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-5">
      <AdminMetricGroup metrics={metrics} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-4">
          <ProvinceListSidebar
            provinces={provinces}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-8">
          <ProvinceDetailEditor province={selectedProvince} />
        </div>
      </div>
    </div>
  )
}
