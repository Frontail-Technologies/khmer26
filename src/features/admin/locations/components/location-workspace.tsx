"use client"

import { useState } from "react"
import { Buildings, HouseLine, MapPin, Plus, Storefront } from "@phosphor-icons/react/dist/ssr"
import { AdminMetricGroup, type AdminMetricItemProps } from "@/features/admin/components/admin-metric-group"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ProvinceListSidebar } from "./province-list-sidebar"
import { ProvinceDetailEditor } from "./province-detail-editor"
import { useAdminProvinces } from "../hooks/locations.queries"
import { useCreateAdminProvince } from "../hooks/locations.mutations"
import type { CambodiaProvince, LocationStats } from "../types"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

interface LocationWorkspaceProps {
  stats?: LocationStats
  provinces?: CambodiaProvince[]
}

export function LocationWorkspace({ stats: initialStats, provinces: initialProvinces = [] }: LocationWorkspaceProps) {
  const { data: remoteProvinces } = useAdminProvinces()
  const provinces = remoteProvinces || initialProvinces
  const createProvince = useCreateAdminProvince()

  const [selectedId, setSelectedId] = useState<string>(provinces[0]?.id ?? "")
  const [addProvinceOpen, setAddProvinceOpen] = useState(false)
  const [provinceName, setProvinceName] = useState("")
  const [provinceNameKm, setProvinceNameKm] = useState("")

  const activeId = selectedId || provinces[0]?.id || ""
  const selectedProvince = provinces.find((p) => p.id === activeId) ?? provinces[0] ?? null
  const nextProvinceId = Math.max(0, ...provinces.map((p) => Number(p.id) || 0)) + 1

  const totalDistricts = provinces.reduce((acc, p) => acc + (p.districts?.length || 0), 0)
  const totalSangkats = provinces.reduce((acc, p) => acc + (p.sangkatsCount || 0), 0)
  const totalListings = provinces.reduce((acc, p) => acc + (p.listingCount || 0), 0)

  const metrics: AdminMetricItemProps[] = [
    {
      label: "Provinces & Capital",
      value: provinces.length || initialStats?.provincesCount || 0,
      subtext: "First-level divisions",
      icon: <MapPin size={16} weight="bold" />,
      tone: "primary",
    },
    {
      label: "Districts / Khans",
      value: totalDistricts || initialStats?.districtsCount || 0,
      subtext: "Secondary units",
      icon: <Buildings size={16} weight="bold" />,
      tone: "indigo",
    },
    {
      label: "Communes / Sangkats",
      value: (totalSangkats || initialStats?.sangkatsCount || 0).toLocaleString(),
      subtext: "Local boundaries",
      icon: <HouseLine size={16} weight="bold" />,
      tone: "purple",
    },
    {
      label: "Marketplace Ads",
      value: (totalListings || initialStats?.activeListingsCount || 0).toLocaleString(),
      subtext: "Geo-tagged ads",
      icon: <Storefront size={16} weight="bold" />,
      tone: "success",
    },
  ]

  const handleCreateProvince = async () => {
    if (!provinceName.trim()) return
    const createdId = nextProvinceId
    await createProvince.mutateAsync({
      id: createdId,
      nameEn: provinceName.trim(),
      nameKm: provinceNameKm.trim() || provinceName.trim(),
      slug: slugify(provinceName) || `province-${createdId}`,
      isActive: true,
    })
    setSelectedId(String(createdId))
    setProvinceName("")
    setProvinceNameKm("")
    setAddProvinceOpen(false)
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex justify-end">
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setAddProvinceOpen(true)}>
          <Plus size={14} weight="bold" />
          <span>Add Province</span>
        </Button>
      </div>

      <AdminMetricGroup metrics={metrics} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        <div className="lg:col-span-4">
          <ProvinceListSidebar
            provinces={provinces}
            selectedId={activeId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="lg:col-span-8">
          <ProvinceDetailEditor
            key={selectedProvince?.id || "none"}
            province={selectedProvince}
          />
        </div>
      </div>

      <Dialog open={addProvinceOpen} onOpenChange={setAddProvinceOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Province</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Field>
              <FieldLabel required>Province Name</FieldLabel>
              <Input value={provinceName} onChange={(e) => setProvinceName(e.target.value)} className="h-9 text-xs" />
            </Field>
            <Field>
              <FieldLabel>Name Khmer</FieldLabel>
              <Input value={provinceNameKm} onChange={(e) => setProvinceNameKm(e.target.value)} className="h-9 text-xs" />
            </Field>
          </div>
          <DialogFooter className="flex-row justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddProvinceOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateProvince} disabled={!provinceName.trim() || createProvince.isPending} className="text-xs">
              {createProvince.isPending ? "Creating..." : "Create Province"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
